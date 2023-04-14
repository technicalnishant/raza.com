import { Component, OnInit, Injector, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import { ViewChild, AfterViewInit, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
 

import { AuthenticationService } from '../../core/services/auth.service';
import { CountriesService } from '../../core/services/country.service';
 
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { isValidaEmail, isValidPhoneNumber, autoCorrectIfPhoneNumber, isValidPhoneOrEmail } from '../../shared/utilities';
import { environment } from '../../../environments/environment';
import { AppBaseComponent } from '../../shared/components/app-base-component';

 
import { CreditCardValidators } from 'angular-cc-library';
import { Observable } from 'rxjs/internal/Observable';
 
 
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CustomerService } from '../../accounts/services/customerService';
import { RazaSharedService } from '../../shared/razaShared.service';

import { State, BillingInfo } from '../../accounts/models/billingInfo';
import { CodeValuePair } from '../../core/models/codeValuePair.model';
import { Country } from '../../shared/model/country';
import { ICheckoutModel, NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { CreditCard } from '../../accounts/models/creditCard'; //BraintreeCard
import { ConfirmPopupDialog } from '../../accounts/dialog/confirm-popup/confirm-popup-dialog';
import { ConfirmMsgDialogComponent } from '../../accounts/dialog/confirm-msg-dialog/confirm-msg-dialog.component';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';

import { AddCreditcardDialog } from '../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { AddCreditcardPayDialog } from '../../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

import { isNullOrUndefined } from "../../shared/utilities";
import { TransactionService } from '../../payments/services/transaction.service';
import { BraintreeService } from '../../payments/services/braintree.service';
import { BraintreeCard } from '../../accounts/models/braintreeCard';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as braintree from 'braintree-web';
import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../payments/models/planOrderInfo.model';

import { ApiProcessResponse } from '../../core/models/ApiProcessResponse';  
 import { TransactionMobProcessBraintreeService } from "../../payments/services/transaction-mob-process-braintree.service";
 import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../payments/models/validate-couponcode-request.model';
 import { RechargeCheckoutModel } from '../../checkout/models/checkout-model';
 import { Plan } from '../../accounts/models/plan';
 import { PlanService } from '../../accounts/services/planService';
 import { CheckoutService } from '../../checkout/services/checkout.service';
 import { ErrorDialogModel } from '../../shared/model/error-dialog.model';
 import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';

 import { DialogCofirmComponent } from '../dialog/dialog-cofirm/dialog-cofirm.component';
 import { BottomUpComponent } from '../dialog/bottom-up/bottom-up.component';
 import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
 declare var jQuery: any;
interface Window {
  webkit?: any;
  androidCallBackInterface:any;
}
declare var window: Window;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends AppBaseComponent implements OnInit {
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
  enc_key:any;
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
  havingExistingCard: boolean = false;
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
  IsEnableFreeTrial:boolean=true;
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
amount:any;
balance:number=0;
processType:any=''; 
addNewCard:boolean=false;
editCard:boolean=false; 
showCartInfo:boolean=false;
currentCart: ICheckoutModel;
process_info:any='';
platform:any;
cardCvvError:boolean=false;

DeviceId:string;
DeviceName:string;
DeviceModel:string;
DeviceType:string;
AppVersion:string;
  hide: boolean;

/**********EOF Google place search **********/
 
constructor( 
  private _bottomSheet: MatBottomSheet,
  private router: Router,
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
   
    private transactionProcessBraintree: TransactionMobProcessBraintreeService,
    private planService: PlanService,
    private checkoutService: CheckoutService,
    _injector: Injector
  ) {
    
    super(_injector);
    
  }

  
  ngOnInit(): void { 
    
    this.enc_key = localStorage.getItem('enc_key');
    //this.enc_key = 'ewoicGhvbmUiOiIzMTI5NzU4NTQyIiwKInBhc3N3b3JkIjoiMTIzNDU2IiwKImNvdW50cnlfaWQiOjEsCiJwbGF0Zm9ybSI6ICJpb3MiLAoiYW1vdW50IjogIjUiCn0=';
    let data_list =  JSON.parse(atob(this.enc_key));
    this.key_arr = data_list;
    console.log(data_list);
    this.userPhone = data_list.phone;
    this.userPass = data_list.password;
    //this.amount= data_list.amount;
    this.search_country_id = data_list.country_id;
    this.countryFromId = this.search_country_id;
    let device_info         = data_list.de;
    var splitted = device_info.split("||"); 
    this.DeviceId = splitted[0];
    this.DeviceName = splitted[1];
    this. DeviceModel = splitted[2];
    this.DeviceType = splitted[4];
    this.AppVersion = splitted[3];
    this.platform = splitted[4];
/*
    localStorage.removeItem('currentUser');
    this.autoLoginUser()
     */
    this.getCards();
    this.getUserPlans();
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
    
    const cart = JSON.parse(localStorage.getItem('currentCart'))
    this.checkoutService.setCurrentCart(this.currentCart);
    
    this.onClickAmountOption(cart);
    console.log(this.route.snapshot);
    (function ($) {
    
      //$('div._hj_feedback_container').css({'display':'none!important'});

      $(document).ready(function(){
        //console.log("Hello from jQuery!");
       // console.log(btoa("stringAngular2")); 
       // console.log(atob("c3RyaW5nQW5ndWxhcjI="));
       // console.log(window);
      });
    })(jQuery);
  }
  autoLoginUser():void
  {
    const phoneOrEmail = this.userPhone;
    console.log("You are here");
   // this.executeCaptcha('login').toPromise().then( (token) => {
      this.executeCaptcha('login').subscribe((token) =>{
      
       console.log('token', token);
      let body = {
        username: phoneOrEmail,
        password: this.userPass,
        captcha: token
      };
      console.log(body);
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
    },(error) => {
          console.log("error "+error); 
    }
    ) 
  }
 
  onIconClick(event){
    event.stopPropagation();
    this.hide = !this.hide;
}
  onClickAmountOption(cart) {
    this.amount= cart.purchaseAmount;
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = cart.purchaseAmount;
    model.couponCode = cart.couponCode;
    model.currencyCode = cart.currencyCode;
    model.cvv = cart.cvv;
    model.planId = cart.planId;
    model.transactiontype = cart.transactiontype;
    model.serviceChargePercentage = cart.serviceChargePercentage;
    model.planName = cart.planName;
    model.countryFrom = cart.countryFrom;
    model.countryTo = cart.countryTo;
    model.cardId = cart.cardId;
    model.isAutoRefill = cart.isAutoRefill;
	model.offerPercentage = (cart.offerPercentage)?cart.offerPercentage:'';
    this.checkoutService.setCurrentCart(model);
   // this.currentCart = this.route.parent.snapshot.data['cart'];
    this.currentCart = model;
    console.log(this.currentCart);
  } 

  getUserPlans(){
    var phone =   this.userPhone;
    if(this.search_country_id == 3)
    {
      phone =   phone.substring(2);
    }
    else{
      phone =   phone.substring(1);
    }

    //this.planService.getPlanInfo(phone).subscribe( 
      this.planService.getStoredPlan(phone).subscribe( 
     
      (res:any)=>{
        console.log(res);
        this.plan = res;
         
        this.balance = this.plan.Balance;
         
        //PlanId
        //this.currentPlanName = res.CardName;
       // this.currentBalance = res.Balance;
      }
    );

/*
    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
        this.balance = this.plan.Balance;
       // this.onClickAmountOption();
        this.isEnableOtherPlan = data.length > 1
      },
      (err: ApiErrorResponse) => console.log(err)
    );*/
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
  setItem(obj:any)
  {
    this.processType = 'pay';
    this.selectedCard =obj;
    
  }
  deleteCardDetails()
  {
    const dialogRef = this.dialog.open(ConfirmMsgDialogComponent, {
      data: {
        success: 'success'
      }
    });
    let card = this.selectedCard;
    dialogRef.afterClosed().subscribe(result => {

      if (result == "success") {
        this.customerService.DeleteCreditCard(card.CardId).subscribe(
          (res: boolean) => {
            if (res) {
              this.razaSnackbarService.openSuccess("Credit card deleted successfully.");
             /* this.customerService.getSavedCreditCards().subscribe(
                (data: CreditCard[]) => { this.creditCards = data;  },
                (err: ApiErrorResponse) => console.log(err),
              )*/

              this.getCards();
            }
            else
              this.razaSnackbarService.openError("Unable to delete information, Please try again.");
          },
          err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
        )
      }
    });

  }
  addCardClick(obj)
  {
    this.selectedCard = null;
    this.processType = obj;
    
  }
  modelChangeFn(event: any)
  {
     
    this.selectedCard.Cvv = event.target.value;
  }
  getChecked(item:any)
  {

    if(item !='' && item.CardId == this.selectedCardPay.CardId)
    {
      return true;
    }
    else
    return false;
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
          //firstFourChars = input.substring(0, 4);
          //res = str.Substring(str.Length - 4);
          this.processType = 'pay';
          this.loadBillingInfo();
          this.havingExistingCard = true;
          this.addNewCard = false;
		   
        } else {
          this.getCreditCardValidityOptions();
          this.getBillingInfo();
          this.havingExistingCard = false;
          this.addNewCard = true;
         
		 
        }
       });
  }

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
  getFormatedCard(obj:any)
  {
    var firstFourChars = obj.substr(0, 4);
    var last = obj.substr(-4);
    return firstFourChars+' ....'+last;
  }

  editCardClick(obj:any)
  {
    
    localStorage.removeItem('errorMsg');
    localStorage.removeItem('errorCode');
    localStorage.removeItem('selectedCvv');
    
    if(this.selectedCard.CardId)
    {
      this.processType = obj;
      
      this.customerService.EditCreditCard(this.selectedCard).subscribe(data => {
        this.cardBillingAddress(data);
      });
    }
  }
  cardBillingAddress(data) {
    this.selectedCard = data;
    this.addNewOrPay();
  }

  androidFuntionRevert(toast) {
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
     
  closeApp()
  {
    if(this.platform == 'ios')
    {
      this.iosFuntionRevert('Webview closed');
    }
    if(this.platform == 'android')
    {
      this.androidFuntionRevert('Webview closed');
    }
     
   
  }

  goBack() 
  {
    console.log( "Process "+ this.processType);
       
      if(this.processType == 'pay')
      {
        //this.closeApp();
        this.router.navigate(['/mobile_pay/'+this.enc_key]);
      }
      else if( this.havingExistingCard == false && this.processType == '')
      {
        this.router.navigate(['/mobile_pay/'+this.enc_key]);
      }
      else
      {
        this.addNewCard = false;
        this.showCartInfo = false;
        this.editCard = false;
        this.havingExistingCard = true;
        this.processType = 'pay';
        this.selectedCard= null;
        this.getCards();
      }

     /* if(this.processType == 'newCrd')
      {
        this.addNewCard = false;
        this.showCartInfo = false;
        this.editCard = false;
        this.havingExistingCard = true;
        this.processType = 'pay';
      }
      if(this.processType == 'editCrd')
      {
        this.editCard = false;
        this.havingExistingCard = true;
        this.showCartInfo = false;
        this.processType = 'pay';
      }

      if(this.processType == 'showCartInfo')
      {
        this.showCartInfo = false;
        this.editCard = false;
        this.addNewCard = false;
        this.havingExistingCard = true;
        this.processType = 'pay'; 
        alert(this.processType);
      }*/
  }
  addNewOrPay()
  {
    
    if(this.processType == 'pay')
    {
      
       
      if (!this.selectedCard.Cvv || this.selectedCard.Cvv =='' || this.selectedCard.Cvv.length < 3)
      {
        this.cardCvvError = true;
        
        return false;
      }
      else{
        this.cardCvvError = false;
        this.processType = 'showCartInfo';
        this.addNewCard = false;
        this.editCard = false;
        this.showCartInfo = true;
      }
      

      console.log( this.selectedCard);
    }

    if(this.processType == 'newCrd')
    {
      this.showCartInfo = false;
      this.addNewCard = true;
      
    }
    if(this.processType == 'editCrd') 
    {
      this.showCartInfo = false;
      this.editCard = true;
    }
    
  }
  getlast4digit()
  {
   
    var last = this.selectedCard.CardNumber.substr(-4);
    return ' ....'+last;
  }
  onPaymentInfoFormSubmit(creditCard: CreditCard) {
   // this.onCreditCardPayment(creditCard);
   this.selectedCard = creditCard;
   this.addNewCard = false;
   this.editCard = false;
   this.showCartInfo = true;
   this.processType = 'showCartInfo'
   

  }
  processPayment()
  {
   this.rechargeNow(this.selectedCard);
  }
  rechargeNow(creditCard: CreditCard)
  {
      this.paymentSubmitted = true;
        let trans_type = '';
        if (this.selectedCard === null)
        return;
      if (this.selectedCard.Cvv.length < 3)
        return;
        
      this.selectedCard.CardHolderName = `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`;
      this.selectedCard.FullName = this.selectedCard.CardHolderName;
      this.selectedCard.PhoneNumber = this.billingInfo.Address.HomePhone;

      localStorage.setItem('selectedCard',  creditCard.CardId.toString());
      let planOrderInfo: ICheckoutOrderInfo;
      planOrderInfo = new RechargeOrderInfo();
        trans_type = 'Recharge';
        planOrderInfo.creditCard = creditCard;
        planOrderInfo.checkoutCart = this.currentCart;
  
  
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
                          let service: TransactionMobProcessBraintreeService = this.transactionProcessBraintree;
                          let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
                        }
                        else
                        {
                          if(this.paymentProcessor=='BrainTree')
                          {
                            this.process_info = this.transactionService.processMobPaymentToBraintree(planOrderInfo );
                           // let return_msg = btoa(this.process_info);
                            //this.showAndroidToast(return_msg); 
                          }
                          else
                          {
                            this.process_info = this.transactionService.processPaymentToCentinel(planOrderInfo);
                            //let return_msg = btoa(this.process_info);
                            //this.showAndroidToast(return_msg);
                          }
                        }
                      } else {
                        this.handleInvalidCouponCodeError();
                      }
                    }).catch(err => {
                      this.handleInvalidCouponCodeError();
                    });
                } 
                else 
                {
              
                
                    if(this.paymentProcessor== 'BrainTree')
                    {
                    this.process_info = this.transactionService.processMobPaymentToBraintree(planOrderInfo);
                     //let return_msg = btoa(this.process_info);
                     //this.showAndroidToast(return_msg); 
                    }
                    else
                    {
                      this.process_info = this.transactionService.processPaymentToCentinel(planOrderInfo);
                     // let return_msg = btoa(this.process_info);
                     //this.showAndroidToast(return_msg); 
                    }
                } 
            }
            else
            {
              /********** Use3DSecure :false  then process transaction directly **********/
              let service: TransactionMobProcessBraintreeService = this.transactionProcessBraintree;
              this.process_info = this.transactionService.processPaymentNormal(planOrderInfo);
              //let return_msg = btoa(this.process_info);
               //this.showAndroidToast(return_msg); 
              
            }
          });
     
     
  }

  returnPaymentResp()
  { 
   
    let return_msg = localStorage.getItem('payment_response');
    localStorage.removeItem('payment_response');
     console.log("Payment response is as given bellow ");
     console.log(return_msg);
    /* this.showAndroidToast(return_msg); */
      

     const dialogRef = this.dialog.open(DialogCofirmComponent, {
      data: {
        success: 'success'
      }
    });
    let card = this.selectedCard;
    dialogRef.afterClosed().subscribe(result => {
      this.showAndroidToast('Mobile web view closed by client. '+ return_msg);
    });

  }

  whatiscvv()
   {
    this._bottomSheet.open(BottomUpComponent);
    /*const dialogRef = this.dialog.open(BottomUpComponent, {
      data: {
        success: 'success'
      }
    });*/
     
   }

  showAndroidToast(obj)
  {
  if(this.platform == 'ios')
    {
      this.iosFuntionRevert(obj);
    }
    if(this.platform == 'android')
    {
      this.androidFuntionRevert(obj);
    }
  }
   // Validate coupon code.
   validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    return this.transactionService.validateCouponCode(req).toPromise();
  }

  handleInvalidCouponCodeError() {
    let error = new ErrorDialogModel();
    error.header = 'Invalid Coupon Code';
    error.message = 'Please check your information and try again.';

    this.currentCart.isHideCouponEdit = false;
    this.currentCart.couponCode = null;

    this.openErrorDialog(error);
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }

  showCardEdit()
  {
    if(this.selectedCard.CardId)
    {
       this.processType = 'editCrd';
       this.showCartInfo = false;
       this.editCard = true;
       this.customerService.EditCreditCard(this.selectedCard).subscribe(data => {
        this.cardBillingAddress(data);
      });
    }
  }
}
