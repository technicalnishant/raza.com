import { Component, OnInit,Input } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotoService } from '../core/services/moto.service'
import { Router } from '@angular/router';
import { CountriesService } from '../core/services/country.service';
import { AuthenticationService } from '../core/services/auth.service';
import { SearchRatesService } from '../rates/searchrates.service';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { NewPlanCheckoutModel, ICheckoutModel, RechargeCheckoutModel } from '../checkout/models/checkout-model';
import { CheckoutService } from '../checkout/services/checkout.service';
import { PromotionPlan } from '../deals/model/promotion-plan';
import { CurrentSetting } from '../core/models/current-setting';
import { TransactionType } from '../payments/models/transaction-request.model';
import { CustomerService } from '../accounts/services/customerService';
import { CreditCard } from '../accounts/models/creditCard'; 

import { State, BillingInfo } from '../accounts/models/billingInfo';
import { CodeValuePair } from '../core/models/codeValuePair.model';
import { Country } from '../shared/model/country';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { TransactionProcessBraintreeService } from "../payments/services/transactionProcessBraintree";
import { TransactionService } from '../payments/services/transaction.service'; 
import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../payments/models/planOrderInfo.model';
import { BraintreeService } from '../payments/services/braintree.service';
import { isNullOrUndefined } from "../shared/utilities";
import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../payments/models/validate-couponcode-request.model';
import { ApiProcessResponse } from '../core/models/ApiProcessResponse';  
import { ErrorDialogModel } from '../shared/model/error-dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/dialog/error-dialog/error-dialog.component';
import { CreditCardValidators } from 'angular-cc-library';
import { CvvBottomComponent } from 'app/cvv-bottom/cvv-bottom.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute } from '@angular/router';

import { PlanService } from '../accounts/services/planService';
import { Plan } from '../accounts/models/plan';
@Component({
  selector: 'app-auto',
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.scss']
})
export class AutoComponent implements OnInit {
  @Input() checkOutModel: ICheckoutModel;
  constructor(
    private router: Router,
    private motoService: MotoService,
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
    private customerService: CustomerService,
    private countryService: CountriesService,
    private razaEnvService: RazaEnvironmentService,
    private transactionProcessBraintree: TransactionProcessBraintreeService,
    private transactionService: TransactionService,
    private braintreeService: BraintreeService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private planService:PlanService,
    

    ) { }
    phone: string;
    order_amount:number=0;

  search_country:any='US';
  currency_code : string='usd';
  search_country_id:any=1; 
    countries: Country[]
  months: CodeValuePair[];
  years: CodeValuePair[];
  states: State[] = [];  
  currentSetting: CurrentSetting;
  userData: any[]; 
  customerSavedCards: CreditCard[];
  userToken:string;
  selectedCard: CreditCard;
  selectedCardPay: CreditCard;
  havingExistingCard: boolean = true;
  billingInfo: BillingInfo;
  paymentInfoForm: FormGroup;
  paymentDetailForm: FormGroup;
  billingInfoForm: FormGroup;
  currentCart: ICheckoutModel;;
  paymentProcessor:any;
  countryFromId: number = 1;
  paymentSubmitted : boolean = false;
  paymentPhone : any;
  exCardNumber: any;
  moto_no :string;
  plan: Plan;
  ngOnInit(): void {
    
    //var moto = 'MOTO092982A52E';

    this.moto_no = this.route.snapshot.paramMap.get('motoId');
    var moto = this.moto_no; //'MOTOB8C7BC6562';
 
    this.userToken = moto;
    localStorage.removeItem('currentUser');  
    this.loginWithToken();
    
    this.paymentDetailForm = this.formBuilder.group({
      CardNumber: ['', [Validators.required, CreditCardValidators.validateCCNumber]],
      Cvv2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      ExpMonth: ['', Validators.required],
      ExpYear: ['', Validators.required]
    });
    this.billingInfoForm = this.formBuilder.group({
      FullName: ['', Validators.required],
      Country: ['', Validators.required],
      State: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      City: ['', Validators.required],
      PostalCode: ['', [Validators.required, Validators.maxLength(10)]]
    });
    
  }


  loginWithToken() 
  {
        let body = {
          username: this.userToken,
          password: '0000000000',
          captcha: ''
        };
     
        this.authService.loginwToken(body, false, "Y").subscribe((response) => {
           if (response != null) {
           this.getMotoInfo();  
        
          }  
        },
        (error) => {
          console.log("Sorry, this link is used or expired. Please call customer service for help.");
          console.error(error.error_description);
         });
 
  }
  
  whatiscvv()
  {
   this._bottomSheet.open(CvvBottomComponent);
  /* const dialogRef = this.dialog.open(BottomUpComponent, {
     data: {
       success: 'success'
     }
   });*/
    
  }
  
  getMotoInfo()
  { 
    if(this.authService.getCurrentUserPhone() !='')
    {
      let phone = this.authService.getCurrentUserPhone();
      this.planService.getPlanByPinlessNumber(phone).subscribe(
        (data: Plan) => {
          this.plan = data;

          let plan_id = this.plan.PlanId;
          
          this.router.navigate(['./account/autorefill/'+plan_id], { queryParams: { action: 'trigger_click' } });
        },
        (err: ApiErrorResponse) => {
          
          
          }
      );

    }
    else
    {
        this.planService.getAllPlans().subscribe(
        (data: Plan[]) => {
          this.plan = data[0];

          let plan_id = this.plan.PlanId;
          
          this.router.navigate(['./account/autorefill/'+plan_id], { queryParams: { action: 'trigger_click' } });
        },
        (err: ApiErrorResponse) => {
          
          
          }
      );
    }
  }

   
  
}
