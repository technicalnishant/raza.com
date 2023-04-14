import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import { ViewChild, AfterViewInit, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../core/services/auth.service';
import { CountriesService } from '../core/services/country.service';
 
import { RazaSnackBarService } from '../shared/razaSnackbar.service';
import { isValidaEmail, isValidPhoneNumber, autoCorrectIfPhoneNumber, isValidPhoneOrEmail } from '../shared/utilities';
import { environment } from '../../environments/environment';
import { AppBaseComponent } from '../shared/components/app-base-component';

 
import { CreditCardValidators } from 'angular-cc-library';
import { Observable } from 'rxjs/internal/Observable';
 
 
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { CustomerService } from '../accounts/services/customerService';
import { RazaSharedService } from '../shared/razaShared.service';

import { State, BillingInfo } from '../accounts/models/billingInfo';
import { CodeValuePair } from '../core/models/codeValuePair.model';
import { Country } from '../shared/model/country';
import { ICheckoutModel, NewPlanCheckoutModel } from '../checkout/models/checkout-model';
import { TransactionType } from '../payments/models/transaction-request.model';
import { CreditCard } from '../accounts/models/creditCard'; //BraintreeCard
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';

import { AddCreditcardDialog } from '../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { AddCreditcardPayDialog } from '../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

import { isNullOrUndefined } from "../shared/utilities";
import { TransactionService } from '../payments/services/transaction.service';
import { BraintreeService } from '../payments/services/braintree.service';
import { BraintreeCard } from '../accounts/models/braintreeCard';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as braintree from 'braintree-web';
import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../payments/models/planOrderInfo.model';

import { ApiProcessResponse } from '../core/models/ApiProcessResponse';  
 import { TransactionProcessBraintreeService } from "../payments/services/transactionProcessBraintree";
 import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../payments/models/validate-couponcode-request.model';
 import { RechargeCheckoutModel } from '../checkout/models/checkout-model';
 import { Plan } from '../accounts/models/plan';
 import { PlanService } from '../accounts/services/planService';
 import { CheckoutService } from '../checkout/services/checkout.service';
declare var jQuery: any;
interface Window {
  webkit?: any;
  androidCallBackInterface:any;
}
declare var window: Window;
 
@Component({
  selector: 'app-web-pay',
  templateUrl: './web-pay.component.html',
  styleUrls: ['./web-pay.component.scss']
})
export class WebPayComponent extends AppBaseComponent implements OnInit {
   
  hide_header_footer:boolean=true;
  first_page:boolean=true;
  second_page:boolean=false;
  third_page:boolean=false;
  fourth_page:boolean=false;
  fifth_page:boolean=false;
  six_page:boolean=false;
  seventh_page:boolean=false;
  eight_page:boolean=false;
  userPhone : any;
  userPass : any;
  enc_key:any='ewogICJ1c2VySWQiOiAiNDUiLAoicGhvbmUiOiIzMTI5NzU4NTQyIiwKInBhc3N3b3JkIjoiMTIzNDU2IiwKICAicGxhdGZvcm0iOiAiaW9zIiwKICAiYW1vdW50IjogIjI5NC4xNSIsCiAgIkVtYWlsIjogImRldl9hcHBsZUBhcnp0ZWNobm9sb2dpZXMuY29tIiwKICAib3RoZXJzIjogImRhdGEiCiAgImJpbGxpbmdfYWRkcmVzcyI6IHsKICAgICJhZGRyZXNzIjogIkxvY2FsIFN0cmVldCBuYW1lIiwKICAgICJjaXR5IjogIk5vaWRhIiwKICAgICJjb3VudHJ5IjogIklOIiwKICAgICJmaXJzdE5hbWUiOiAiVGVzdCIsCiAgICAibGFzdE5hbWUiOiAiVGVzdCIsCiAgICAicGhvbmVOdW1iZXIiOiAiOTQ1ODc4ODg3NCIsCiAgICAic3RhdGUiOiAiVXR0ZXIgUHJhZGVzaCIsCiAgICAiemlwIjogIjIwMTMwMSIKICB9Cn0=';
  key_arr:any;
  creditCard:CreditCard;
  paymentDetailForm: FormGroup;
  billingInfoForm: FormGroup;
  paymentInfoForm: FormGroup;
  existingCreditCardForm: FormGroup;

  countries: Country[]
  fromCountry: Country[] = [];
  months: CodeValuePair[];
  years: CodeValuePair[];
  states: State[] = [];
  customerSavedCards: CreditCard[];
  havingExistingCard: boolean = true;
  selectedCard: CreditCard;
  selectedCardPay: CreditCard;
  braintreeCard:BraintreeCard;
  cvvStored: string;
  billingInfo: BillingInfo;
  countryFromId: number = 1;
  autoRefillTipText: string;
  braintreeToken:any;
  paymentProcessor:any;
  countryId:number;
  IsEnableFreeTrial:boolean=false;
  autocompleteInput: string;
queryWait: boolean;
checked:boolean=true;

address: Object;
establishmentAddress: Object;
formattedAddress: string;
formattedEstablishmentAddress: string;
phone: string;
search_country:any='US';
search_country_id:any=1;
plan: Plan;
isEnableOtherPlan: boolean = false;
isAutoRefillEnable: boolean = false;
paymentSubmitted: boolean;
/**********EOF Google place search **********/
@Input() checkOutModel: ICheckoutModel;
  constructor( private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private _formBuilder: FormBuilder,
    
    private countriesService: CountriesService,
    private dialog: MatDialog,
    private snackBarService: RazaSnackBarService,

    public zone: NgZone,
    private transactionService: TransactionService, 
    private braintreeService: BraintreeService,
    private formBuilder: FormBuilder,
    private countryService: CountriesService,
    private razaEnvService: RazaEnvironmentService,
    private customerService: CustomerService,
    
    private razaSnackbarService: RazaSnackBarService,
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private razaSharedService: RazaSharedService,
   
    private transactionProcessBraintree: TransactionProcessBraintreeService,
    private planService: PlanService,
    private checkoutService: CheckoutService,
    _injector: Injector
  ) {
    
    super(_injector);
    
  }

  ngOnInit(): void {
     this.key_arr = atob(this.enc_key);
    
    
    this.userPhone = '3129758542';
    this.userPass = '123456';
    localStorage.removeItem('currentUser');
    this.autoLoginUser()
    this.getCreditCardValidityOptions();
    this.paymentDetailForm = this._formBuilder.group({
      CardNumber: ['', [Validators.required, CreditCardValidators.validateCCNumber]],
      Cvv2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      ExpMonth: ['', Validators.required],
      ExpYear: ['', Validators.required]
    });
    this.billingInfoForm = this._formBuilder.group({
      FullName: ['', Validators.required],
      Country: ['', Validators.required],
      State: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      City: ['', Validators.required],
      PostalCode: ['', [Validators.required, Validators.maxLength(10)]]
    });
 
 
    (function ($) {
    
      //$('div._hj_feedback_container').css({'display':'none!important'});

      $(document).ready(function(){
        console.log("Hello from jQuery!");
        console.log(btoa("stringAngular2")); 
        console.log(atob("c3RyaW5nQW5ndWxhcjI="));
        console.log(window);
      });
    })(jQuery);

  }

  autoLoginUser():void
  {
    const phoneOrEmail = this.userPhone;
    this.executeCaptcha('login').toPromise().then(token => {
      console.log('token', token);
      let body = {
        username: phoneOrEmail,
        password: this.userPass,
        captcha: token
      };
      
      // console.log('body', body);
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {
          this.getCards();
          this.razaSharedService.getTopThreeCountry().subscribe((res: any) => {
            this.fromCountry = res.slice(0, 3);
            this.getUserPlans();
          });
      
          
        }  
      },
        (error) => {
           
        });
    }
    );
  }

  getUserPlans(){
    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
        this.isEnableOtherPlan = data.length > 1
      },
      (err: ApiErrorResponse) => console.log(err)
    );
  }
  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res;
     
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }
  getCreditCardValidityOptions() {
    this.years = this.razaEnvService.getYears();
    this.months = this.razaEnvService.getMonths();
  }
  getBillingInfo() {
    this.customerService.GetBillingInfo().toPromise().then(
      (res: BillingInfo) => {
        if (res.Address) {
          //this.onCountryChange(res.Address.Country.CountryId)

          this.search_country_id = res.Address.Country.CountryId;
        }

        if(res.Email && res.Email !='')
        {
          var user_email = res.Email;
          if(user_email.includes("@raza.temp"))
          {
            res.Email = '';
          }
        }

        const billInfo = {
          firstName: res.FirstName,
          lastName: res.LastName,
          email: res.Email,
          address: res.Address.StreetAddress,
          zipcode: res.Address.ZipCode,
          city: res.Address.City,
          country: res.Address.Country.CountryId,
          state: res.Address.State,
          phoneNumber: res.Address.HomePhone,
        };
        this.billingInfo = res;
        this.billingInfoForm.patchValue(billInfo);
      })
  }
  getCards()
  {
    this.customerService.getSavedCreditCards().toPromise().then(
      (res: CreditCard[]) => {
        if (res.length > 0) {
          this.customerSavedCards = res.splice(0, 2);
		 
          this.selectedCardPay=this.customerSavedCards[0];
          console.log(this.selectedCardPay);
          this.selectedCard = this.selectedCardPay;
          //localStorage.setItem('card':{card:this.selectedCardPay.CardId, selectedCard:this.selectedCardPay.Cvv});
          this.loadBillingInfo();
          this.havingExistingCard = true;
		   
        } else {
          this.getCreditCardValidityOptions();
          this.getBillingInfo();
          this.havingExistingCard = false;
		 
        }
       });
  }

  whatiscvv()
  {}
  getCardIcon(CreditCard: CreditCard) {
    switch (CreditCard.CardType.toLowerCase()) {
      case 'visa':
        return 'assets/images/visa_card.png';
        break;
      case 'mastercard':
        return 'assets/images/master-card.png';
        break;
      case 'discover':
        return 'assets/images/discover-card.png';
        break;
      case 'amex':
        return 'assets/images/american-card.png';
        break;
      default:
        break;
    }
  }
  isDisplayCvvRequired(item: CreditCard): boolean {
    return this.selectedCard.CardId === item.CardId && item.Cvv.length === 0 && this.paymentSubmitted;
  }
  loadStates(flagDefault: boolean = false): void {
   this.countryId = this.billingInfoForm.get('Country').value;
   this.search_country_id = this.countryId;

    if (!isNullOrUndefined(this.countryId))
      this.countriesService.getStates(this.countryId).subscribe(
        (res: State[]) => {
          this.states = res;
          
        }
      )
  }


  paymentDetailFormSubmit(): void {

    if (!this.billingInfoForm.valid)
      return;

    let body = {
      //CardNumber: this.paymentDetailForm.get('CardNumber').value,
      CardNumber: (this.paymentDetailForm.get('CardNumber').value as string).replace(/\s/g, ''),
      Cvv2: this.paymentDetailForm.get('Cvv2').value,
      ExpMonth: this.paymentDetailForm.get('ExpMonth').value,
      ExpYear: this.paymentDetailForm.get('ExpYear').value,
      NameOnCard: this.billingInfoForm.get('FullName').value,
      Country: this.billingInfoForm.get('Country').value,
      BillingAddress: this.billingInfoForm.get('BillingAddress').value,
      City: this.billingInfoForm.get('City').value,
      State: this.billingInfoForm.get('State').value,
      ZipCode: this.billingInfoForm.get('PostalCode').value
    }

 

    let data='success'+','+body.Cvv2;
    this.customerService.SaveCreditCard(body).subscribe(

      (res: boolean) => {
        if (res) {
        /*  this.customerService.getSavedCreditCards().toPromise().then((cr: CreditCard[]) => {
            creditCard.CardId = cr[0].CardId;
            this.onCreditCardPayment(creditCard);
          })*/

   
          const model: RechargeCheckoutModel = new RechargeCheckoutModel();

          model.purchaseAmount = 10;
          model.couponCode = '';
          model.currencyCode = this.plan.CurrencyCode;
          model.cvv = '';
          model.planId = this.plan.PlanId
          model.transactiontype = TransactionType.Recharge;
          model.serviceChargePercentage = this.plan.ServiceChargePercent;
          model.planName = this.plan.CardName;
          model.countryFrom = this.plan.CountryFrom;
          model.countryTo = this.plan.CountryTo;
          model.cardId = this.plan.CardId;
          model.isAutoRefill = this.isAutoRefillEnable;
          this.checkoutService.setCurrentCart(model);
           

        }
        else 
          this.snackBarService.openSuccess("Credit card saved successfully.");
        },
      
          err => {
         console.log(err.message);
       // this.razaSnackBarService.openError("An error occurred!! Please try again.")
      }
     
    )
  }

   // Validate coupon code.
   validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    return this.transactionService.validateCouponCode(req).toPromise();
  }
  /**
   * On credit card payment Option.
   */
  private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
    let trans_type = '';
 
    localStorage.setItem('selectedCard',  creditCard.CardId.toString());
    let planOrderInfo: ICheckoutOrderInfo;
       
        planOrderInfo = new RechargeOrderInfo();
        trans_type = 'Recharge';
        planOrderInfo.creditCard = creditCard;
        // planOrderInfo.checkoutCart = this.currentCart;


    var first_fivenum = creditCard.CardNumber.substring(0, 5);
    this.braintreeService.testProcess(first_fivenum, trans_type).subscribe( (data: ApiProcessResponse)=>{ 
    this.paymentProcessor = data.ThreeDSecureGateway; 
      if(data.Use3DSecure)
        {
           
          if (!isNullOrUndefined(planOrderInfo.checkoutCart.couponCode) && planOrderInfo.checkoutCart.couponCode.length > 0) {
            this.validateCoupon(planOrderInfo.checkoutCart.getValidateCouponCodeReqModel(planOrderInfo.checkoutCart.couponCode))
              .then((res: ValidateCouponCodeResponseModel) => {
                if (res.Status) 
                {
                  if(planOrderInfo.checkoutCart.couponCode == 'FREETRIAL')
                  {
                    /********** Use3DSecure :false  then process transaction directly **********/
                    let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
                    let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
                  }
                  else
                  {
                    if(this.paymentProcessor=='BrainTree')
                    {
                      this.transactionService.processPaymentToBraintree(planOrderInfo );
                    }
                    else
                    {
                      this.transactionService.processPaymentToCentinel(planOrderInfo);
                    }
                  }
                } else {
                  //this.handleInvalidCouponCodeError();
                }
              }).catch(err => {
                //this.handleInvalidCouponCodeError();
              });
          } 
          else 
          {
         
          
              if(this.paymentProcessor== 'BrainTree')
              {
                this.transactionService.processPaymentToBraintree(planOrderInfo);
              }
              else
              {
                this.transactionService.processPaymentToCentinel(planOrderInfo);
              }
          } 
      }
      else
      {
        /********** Use3DSecure :false  then process transaction directly **********/
        let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
        let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
         
      }
    });
  }

  first_step_click()
  {
    this.first_page=false;
    this.second_page=true;
  }

  second_step_click()
  {
    this.second_page=false;
    this.third_page = true;
  }

  third_step_click()
  {
    
    this.third_page = false;
    this.fourth_page = true;
  }

  fourth_step_click()
  {
    this.fourth_page = false;
    this.fifth_page = true;
  }

  fifth_step_click()
  {
    this.fifth_page = false;
    this.six_page = true;
  }
  sixth_step_click()
  {
    this.six_page = false;
    this.seventh_page = true;
  }

  seventh_step_click()
  {
    this.seventh_page = false;
    this.eight_page = true;
  }
   showAndroidToast(toast) {
    console.log(toast);
    try {
         window.androidCallBackInterface.callBackFormData(toast);
        } catch(err) {
       }
    }

    iosFuntionRevert(resultdata)
    {
      console.log(resultdata);
      try {
           var message = resultdata;
            window.webkit.messageHandlers.callbackHandler.postMessage(message);
            } 
            catch(err) {
            }
 
    }
}
