import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
//import { isNullOrUndefined } from 'util';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { PlanService } from '../../../accounts/services/planService';
import { TransactionService } from '../../../payments/services/transaction.service';
import { CustomerService } from '../../../accounts/services/customerService';
import { ScriptService } from '../../../payments/paypal/service/script.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../../payments/models/validate-couponcode-request.model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { RechargeOrderInfo } from '../../../payments/models/planOrderInfo.model';
import { RechargeCheckoutModel } from '../../../checkout/models/checkout-model';
import { Plan } from '../../../accounts/models/plan';
import { RechargeOptionsModel } from '../../models/recharge-options.model';

import { CreditCard } from '../../../accounts/models/creditCard';
import { environment } from '../../../../environments/environment';
import { isNullOrUndefined } from "../../../shared/utilities";

import { LoginpopupComponent } from '../../../core/loginpopup/loginpopup.component';
import { SignuppopupComponent } from '../../../core/signuppopup/signuppopup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-recharge',
  templateUrl: './quick-recharge.component.html',
  styleUrls: ['./quick-recharge.component.scss']
})
export class QuickRechargeComponent implements OnInit, OnDestroy {


  constructor(
    private router: Router,
    private titleService: Title,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private planService: PlanService,
    private transactionService: TransactionService,
    private customerService: CustomerService,
    private scriptService: ScriptService,
    private checkOutService: CheckoutService,
    private razaLayoutService: RazaLayoutService,
    public dialog: MatDialog,
  ) { }

  rechargeForm: FormGroup;
  defaultPlan: Plan;
  selectedCard: CreditCard;
  isAuthenticated: boolean;

  ngOnInit() {
    this.titleService.setTitle('Quick Rechagre');
    this.razaLayoutService.setFixedHeader(true);
    this.rechargeForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]],
      password: [''],
      rechargeAmount: ['', Validators.required],
      lastDigitsOfCard: ['', Validators.required],
      cvv: ['', Validators.required],
      couponCode: ['']
    });
    this.rechargeForm.controls['rechargeAmount'].setValue(10);
    this.isAuthenticated = this.authService.isAuthenticated();

    if (!this.authService.isAuthenticated()) {
      this.rechargeForm.get('password').setValidators(Validators.required);
    }

    //register cardinal script.
    this.scriptService.cleanupAndRegisterScript(environment.songbirdJsUrl, 'Cardinal', (res) => {

    });

  }

  ngOnDestroy(): void {
    //cleanup cardinal script.
    this.scriptService.cleanup(environment.songbirdJsUrl, 'Cardinal')
  }


  onRechargeFormSubmit() {
    if (!this.rechargeForm.valid) {
      return;
    }

    let body = {
      username: this.rechargeForm.value.phoneNumber,
      password: this.rechargeForm.value.password
    };

    if (this.authService.isAuthenticated()) {
      this.getPlanInfoAndProcess();
    } else {
      this.authService.login(body).toPromise().then(res => {
        this.getPlanInfoAndProcess();
      }).catch(err => {
        this.rechargeForm.controls['password'].setErrors({ 'Invalid_grant': true });
      });

    }

  }

  getPlanInfoAndProcess() {
    this.planService.getPlanByPinlessNumber(this.rechargeForm.value.phoneNumber).subscribe(
      (plans: Plan) => {
        this.defaultPlan = plans;
        const rechargeModel = new RechargeCheckoutModel()
        rechargeModel.purchaseAmount = this.rechargeForm.value.rechargeAmount;
        rechargeModel.couponCode = this.rechargeForm.value.couponCode;
        rechargeModel.creditCardLastDigit = this.rechargeForm.value.lastDigitsOfCard;
        rechargeModel.cvv = this.rechargeForm.value.cvv;
        rechargeModel.currencyCode = this.defaultPlan.CurrencyCode;
        rechargeModel.planId = this.defaultPlan.PlanId;
        rechargeModel.transactiontype = TransactionType.Recharge;
        rechargeModel.planName = this.defaultPlan.CardName;
        rechargeModel.serviceChargePercentage = this.defaultPlan.ServiceChargePercent;
        rechargeModel.countryFrom = this.defaultPlan.CountryFrom;
        rechargeModel.countryTo = this.defaultPlan.CountryTo;
		rechargeModel.offerPercentage = '';
     
        this.getSelectedCreditCard(rechargeModel).subscribe(
          (res: CreditCard) => {
            if (!isNullOrUndefined(res)) {
              this.selectedCard = res;
              res.Cvv = rechargeModel.cvv;
            }

          },
          err => { console.log(err) },
          () => {
            if (isNullOrUndefined(this.selectedCard)) {
              return;
            } else {
              this.validateAndProcessRecharge(rechargeModel);
            }
          })
      }
    )
  }

  validateAndProcessRecharge(rechargeModel: RechargeCheckoutModel) {
    if (!isNullOrUndefined(rechargeModel.couponCode) && rechargeModel.couponCode.length > 0) {
      this.validateCoupon(rechargeModel)
        .then((response: ValidateCouponCodeResponseModel) => {
          if (response.Status) {
            this.processRechargeToPayment(rechargeModel);
          } else {
            this.transactionService.openPaymentFailedDialog();
          }
        })
    } else {
      this.processRechargeToPayment(rechargeModel);
    }
  }

  processRechargeToPayment(model: RechargeCheckoutModel) {
    const rechargeOrder: RechargeOrderInfo = {
      creditCard: this.selectedCard,
      checkoutCart: model,
      logoutAfterProcess: false
    }

    this.checkOutService.setCurrentCart(model);
    //return this.transactionService.processPaymentToCentinel(rechargeOrder);
     
    return this.transactionService.processPaymentToBraintree(rechargeOrder);
	
  }

  /*
    get all user card and match with last digits. 
  */
  getSelectedCreditCard(rechargeModel: RechargeCheckoutModel) {
    return this.customerService.getSavedCreditCards().pipe(map((res: CreditCard[]) => {
      const card = res.find(a => a.CardNumber.endsWith(rechargeModel.creditCardLastDigit));
      if (isNullOrUndefined(card)) {
        this.rechargeForm.controls['lastDigitsOfCard'].setErrors({ 'Invalid_Card': true });
      }
      return card;
    }));
  }

  // Validate coupon code.
  validateCoupon(rechargeModel: RechargeCheckoutModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    const validateCouponCodeReq: ValidateCouponCodeRequestModel = {
      CouponCode: rechargeModel.couponCode,
      CardId: this.defaultPlan.CardId,
      CountryFrom: this.defaultPlan.CountryFrom,
      CountryTo: this.defaultPlan.CountryTo,
      Price: rechargeModel.purchaseAmount,
      TransType: TransactionType.Recharge
    }
    return this.transactionService.validateCouponCode(validateCouponCodeReq).toPromise();
  }


  redirectToRecharge(rechargeModel: RechargeOptionsModel) {
    this.router.navigate(['recharge/payment', this.defaultPlan.Pin]);
  }
  openPopup(obj:any)
  {
    if(obj =='login')
    {
      this.dialog.open(LoginpopupComponent, {
     
        data: { slideIndex: obj }
      });
    }
    else
    {
      this.dialog.open(SignuppopupComponent, {
     
        data: { slideIndex: obj }
      });
    }

  }
  
  setrechargeAmount(obj:any)
  {
     
    this.rechargeForm.controls['rechargeAmount'].setValue(obj);
  }


  getActiveClass(obj:any)
  {
    if(obj == this.rechargeForm.value.rechargeAmount)
    {
      return 'active';
    }
    else
    return '';
  }
 
}
