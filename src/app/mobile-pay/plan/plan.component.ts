import { Component, OnInit, Injector, Input } from '@angular/core';
//import { FormControl } from '@angular/forms';
//import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog} from '@angular/material/dialog';
import { ViewChild, AfterViewInit, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
 
import { ElementRef } from '@angular/core';
import { AuthenticationService } from '../../core/services/auth.service';
import { CountriesService } from '../../core/services/country.service';
 
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
//import { isValidaEmail, isValidPhoneNumber, autoCorrectIfPhoneNumber, isValidPhoneOrEmail } from '../../shared/utilities';
//import { environment } from '../../../environments/environment';
import { AppBaseComponent } from '../../shared/components/app-base-component';

 
//import { CreditCardValidators } from 'angular-cc-library';
//import { Observable } from 'rxjs/internal/Observable';
 
 
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CustomerService } from '../../accounts/services/customerService';
import { RazaSharedService } from '../../shared/razaShared.service';

import { State, BillingInfo } from '../../accounts/models/billingInfo';
import { CodeValuePair } from '../../core/models/codeValuePair.model';
import { Country } from '../../shared/model/country';
import { ICheckoutModel, NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { CreditCard } from '../../accounts/models/creditCard'; //BraintreeCard
//import { ConfirmPopupDialog } from '../../accounts/dialog/confirm-popup/confirm-popup-dialog';
//import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';

//import { AddCreditcardDialog } from '../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
//import { AddCreditcardPayDialog } from '../../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

//import { isNullOrUndefined } from "../../shared/utilities";
import { TransactionService } from '../../payments/services/transaction.service';
import { BraintreeService } from '../../payments/services/braintree.service';
import { BraintreeCard } from '../../accounts/models/braintreeCard';

import { HttpClient, HttpHeaders } from '@angular/common/http';
//import * as braintree from 'braintree-web';
//import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../payments/models/planOrderInfo.model';

//import { ApiProcessResponse } from '../../core/models/ApiProcessResponse';  
 import { TransactionMobProcessBraintreeService } from "../../payments/services/transaction-mob-process-braintree.service";
 //import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../payments/models/validate-couponcode-request.model';
 import { RechargeCheckoutModel } from '../../checkout/models/checkout-model';
 import { Plan } from '../../accounts/models/plan';
 import { PlanService } from '../../accounts/services/planService';
 import { CheckoutService } from '../../checkout/services/checkout.service';

 import { RechargeService } from '../../recharge/services/recharge.Service';

 //import { ErrorDialogModel } from '../../shared/model/error-dialog.model';
 //import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';
 import { CurrentSetting } from "../../core/models/current-setting";
 declare var jQuery: any;
interface Window {
  webkit?: any;
  androidCallBackInterface:any;
}
declare var window: Window;
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent extends AppBaseComponent implements OnInit {
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
  planId: string;
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
balance:number=0;
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
amount:any=10;
processType:any=''; 
addNewCard:boolean=false;
editCard:boolean=false; 
showCartInfo:boolean=false;
currentCart: ICheckoutModel;
process_info:any='';
platform:any;
cardCvvError:boolean=false;
rechargeAmounts: number[];

DeviceId:string;
DeviceName:string;
DeviceModel:string;
DeviceType:string;
AppVersion:string;

/**********EOF Google place search **********/
private static _setting: CurrentSetting;
constructor( 
  
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
    private rechargeService: RechargeService,
    private transactionProcessBraintree: TransactionMobProcessBraintreeService,
    private planService: PlanService,
    private checkoutService: CheckoutService,
    _injector: Injector
  ) {
    
    super(_injector);
    
  }
  @ViewChild('privatUserCheckbox') privatUserCheckbox: ElementRef;
  
  ngOnInit(): void {

    /***
     * 
     *
     *  {
        "password" : "123456",
        "phone" : "7733961313",
        "country_id" : 1,
        "de" : "9fc3772dcb9c1364d6cba57ba5694c8636109ba2f1334041316c142dbdd061da||iPhone||iphone||5.7||ios"
        DeviceId:0
        DeviceName:1
        DeviceModel:2
        DeviceType:3
        AppVersion:4
        platform:5
      }
      
     */
    localStorage.removeItem('currentUser');
    this.enc_key    = this.route.snapshot.paramMap.get('post_data');
    localStorage.setItem('enc_key', this.enc_key);
    
    //this.enc_key  = 'ewoicGhvbmUiOiIzMTI5NzU4NTQyIiwKInBhc3N3b3JkIjoiMTIzNDU2IiwKImNvdW50cnlfaWQiOjEsCiJwbGF0Zm9ybSI6ICJpb3MiLAoiYW1vdW50IjogIjUiCn0=';
    let data_list   =  JSON.parse(atob(this.enc_key));
    this.key_arr    = data_list;
    console.log(data_list);
    this.userPhone  = data_list.phone;
    this.userPass   = data_list.password;
    this.autoLoginUser();
    //this.countries_list
    this.search_country_id  = data_list.country_id;
    this.setCurrentCountry();
    this.countryFromId      = this.search_country_id;
    let device_info         = data_list.de;
    var splitted = device_info.split("||"); 
    this.DeviceId = splitted[0];
    this.DeviceName = splitted[1];
    this. DeviceModel = splitted[2];
    this.DeviceType = splitted[4];
    this.AppVersion = splitted[3];
    this.platform = splitted[4];
     //this.loginWithToken();
   
  }
  setCurrentCountry()
  {
    //localStorage.removeItem('session_key');
      let countries_list = [{CountryId:1,CountryName:"U.S.A",CountryCode:'1'},
    {CountryId:2,CountryName:"CANADA",CountryCode:'1'},
    {CountryId:3,CountryName:"U.K",CountryCode:'44'}];

    for(var j = 0; j <  countries_list.length;j++){
      if(countries_list[j].CountryId == this.search_country_id)
      { 
        const setting = new CurrentSetting();
        setting.country = countries_list[j];
         this.razaEnvService.setCurrentSetting(setting);
      }
  } 
}
  autoLoginUser() 
  {
    const phoneOrEmail = this.userPhone;
    this.executeCaptcha('login').subscribe((token) =>{
    let body = {
        username: phoneOrEmail,
        password: this.userPass,
        captcha: token
      };
      
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {
          this.getUserPlans();  
        
        }  
      },
        (error) => {
          console.log(error.error_description);
         // this.closeApp();
        });
    },(error) => {
        console.log(error.error_description);
          //console.log("error "+error); 
         // this.closeApp();
    }
    ) 
  }

  onClickAmountOption(amount: number) {
    this.amount = amount;

    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = amount;
    model.couponCode = '';
    model.currencyCode = this.plan.CurrencyCode;
    model.cvv = '';
    model.planId = this.plan.PlanId
    model.transactiontype = TransactionType.MR;
    model.serviceChargePercentage = this.plan.ServiceChargePercent;
    model.planName = this.plan.CardName;
    model.countryFrom = this.plan.CountryFrom;
    model.countryTo = this.plan.CountryTo;
    model.cardId = this.plan.CardId;
    model.isAutoRefill = this.isAutoRefillEnable;
    model.offerPercentage =  ''; 
    localStorage.setItem('currentCart', JSON.stringify(model))
    //this.router.navigate(['/mobile_pay']);
    //this.currentCart = model;
    
  }
continue()
{
   this.router.navigate(['/mobile_pay']);
}
getSelectedClass(amt:any)
{
  if(this.amount == amt)
  {
    return 'selected-dom';
  }
  else{
    return '';
  }
}
getChecked(amt:any)
{
  if(this.amount == amt)
  {
    return true;
  }
  else{
    return false;
  }
}
  selectAmount(id: any) {
    //this.id = id;
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
    
   // this.planService.getPlanInfo(phone).subscribe(
      this.planService.getStoredPlan(phone).subscribe(
      (res:any)=>{
        console.log(res);
       
        this.plan = res;
        this.getRechargeOption(this.plan.CardId)
        this.planId = this.plan.PlanId;
        this.balance = this.plan.Balance;
        /*this.planService.getPlan(this.planId).subscribe(
          (res: Plan) => this.plan = res,
          err => console.log(err),
          () => ''
        );*/
        //PlanId
        //this.currentPlanName = res.CardName;
       // this.currentBalance = res.Balance;
      }
    );

    
  }
     getRechargeOption(card_id) {
    this.rechargeService.getRechargeAmounts(card_id).subscribe(
      (res: number[]) => {
        this.rechargeAmounts = res;
        this.onClickAmountOption(res[0]);
      }
    )
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
      console.log(this.platform);
      if(this.platform == 'ios')
      {
        this.iosFuntionRevert('Mobile web view closed by client');
      }
      if(this.platform == 'android')
      {
        this.androidFuntionRevert('Mobile web view closed by client');
      }
       
     
    }
  
   
  goBack()
  {
      this.closeApp();
  
  }
   
   
  loginWithToken() 
  {
  
      this.executeCaptcha('login').subscribe((token) =>{
      
       console.log('token', token);
      let body = {
        username: '056D9DD399B7472',
        password: '0000000000',
        captcha: token
      };
      console.log(body);
      // console.log('body', body);
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {
           
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


}
