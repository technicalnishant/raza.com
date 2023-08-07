import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { CustomerService } from '../../services/customerService';
import { OrderHistory } from '../../models/orderHistory';
 
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Country } from '../../../shared/model/country';
import { mobileTopupModel } from '../../../mobiletopup/model/mobileTopupModel';
import { OperatorDenominations } from '../../../mobiletopup/model/operatorDenominations';
import { CountriesService } from '../../../core/services/country.service';
import { MobiletopupService } from '../../../mobiletopup/mobiletopup.service';
 
import { SideBarService } from '../../../core/sidemenu/sidemenu.service';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { ICheckoutModel, MobileTopupCheckoutModel } from '../../../checkout/models/checkout-model';
import { AuthenticationService } from '../../../core/services/auth.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { isNullOrUndefined } from "../../../shared/utilities";
import { Location } from '@angular/common';
import { MetaTagsService } from 'app/core/services/meta.service';
import { TopupDialogComponent } from 'app/mobiletopup/dialog/topup-dialog/topup-dialog.component';
import { BundleDialogComponent } from 'app/mobiletopup/dialog/bundle-dialog/bundle-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreditCard } from '../../models/creditCard';


import { IPaypalCheckoutOrderInfo, ActivationOrderInfo, RechargeOrderInfo, ICheckoutOrderInfo, MobileTopupOrderInfo } from '../../../payments/models/planOrderInfo.model';
import { TransactionProcessBraintreeService } from 'app/payments/services/transactionProcessBraintree';
import { TransactionService } from 'app/payments/services/transaction.service';
import { TransactionProcessFacadeService } from 'app/payments/services/transactionProcessFacade';
import { ApiProcessResponse } from 'app/core/models/ApiProcessResponse';
import { BraintreeService } from 'app/payments/services/braintree.service';
import { ValidateCouponCodeRequestModel, ValidateCouponCodeResponseModel } from 'app/payments/models/validate-couponcode-request.model';
import { ErrorDialogModel } from 'app/shared/model/error-dialog.model';
import { ErrorDialogComponent } from 'app/shared/dialog/error-dialog/error-dialog.component';
import {  NewPlanCheckoutModel, RechargeCheckoutModel } from 'app/checkout/models/checkout-model'; 

@Component({
  selector: 'app-account-international-topup',
  templateUrl: './account-international-topup.component.html',
  styleUrls: ['./account-international-topup.component.scss']
})
export class AccountInternationalTopupComponent implements OnInit {
  
  orderHistoryPage: number = 1;
  orderHistoryList: OrderHistory[] = [];
  showTopupForm:boolean=false;


  allCountry: Country[];
  mycountryName: string;
  mycountryId: number;
  filteredCountry: Observable<Country[]>;
  // autoControl = new FormControl();
  mobileTopupData: mobileTopupModel;
  operatorDenominations: OperatorDenominations[];
  mobileTopupForm: FormGroup;
  amountSent: number;
  countryName:String;
  countrySelect = new FormControl();
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isTopUpEnable: boolean = false;
  pinnumber:number;
  topup_no:string;
  iso:string;
  showOperators:boolean=false;
  operatorsList:any=[];
  countryTo:number=0;
  selectionType:any; 
  currentOperator:string='';
  bundleInfo:any;
  topup_ctr: any;

  bundleTopupPlans:any;
  showCredicard : boolean=false;

 
  phoneNumber:any;
  toCountryId:number;
  fromCountryId:number;
  denominatons:any;
  isAutorefill:boolean=false;


  username: string;
 
	 
	isEnableOtherPlan: boolean = false;
  is_notification: boolean=false;
  sendPushNotification: boolean=false;
  sendSMSPromo: boolean=false;
  uri:string='';
  myModel:boolean=true;
  isSmallScreen: boolean=false;
  showPlan: boolean;
  selectedDenomination:number=10;
  isAutoRefillEnable: boolean;
  ratesLoaded:boolean=false;
  //currentCart: ICheckoutModel;
   
  paymentProcessor:any;
  currentCartObs$: Subscription;
  currentCart: ICheckoutModel;
  topupOperators:any;
  constructor(private titleService: Title,
    private router: Router,
	private customerService: CustomerService,
    private razalayoutService: RazaLayoutService,
    private formBuilder: FormBuilder,
    private countryService: CountriesService,
    private sideBarService: SideBarService,
    private mobileTopupService: MobiletopupService,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
	private location:Location,
  private metaTagsService:MetaTagsService,
  private dialog:MatDialog,

  
  private transactionService: TransactionService,
  private transactionProcessFacade: TransactionProcessFacadeService,
  private transactionProcessBraintree: TransactionProcessBraintreeService,
  private braintreeService: BraintreeService,

  ) { }

  ngOnInit() {
    this.titleService.setTitle('InterNational TopUp');
    this.razalayoutService.setFixedHeader(true);
	this.loadOrderHistory();

/***********Mobile Topup functionality***********/
  this.selectionType = 'topup';
  this.titleService.setTitle('Mobile Topup');
  this.metaTagsService.getMetaTagsData('mobiletopup');
  this.sideBarService.toggle();
  this.getCountries();
this.mycountryId = 0;
  this.mobileTopupForm = this.formBuilder.group({
    countryTo: ['', [Validators.required]],
    phoneNumber: ['', Validators.required],
    topUpAmount: [null]
  });

  this.mobileTopupForm.get('countryTo').valueChanges.subscribe(res => {
    this.changeNumber();
  });

  this.filteredCountry = this.mobileTopupForm.get('countryTo').valueChanges
    .pipe(
      startWith<string | Country>(''),
      map(value => typeof value === 'string' ? value : value.CountryName),
      map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
    );

  this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
    this.currentSetting = res;
  });

  }

  confirmPopup() {
    // do something
  }

  internationalTopUp() {
   this.router.navigate(['mobiletopup']);
   //this.showTopupForm = true;
  }
  
  recharge(instanceId) {
    //console.log('aa', instanceId); 
   this.router.navigateByUrl("recharge/"+ instanceId);
 }

 rechargeRedirect(obj)
 {
  console.log(obj);
  //return false;
  //this.router.navigateByUrl("mobiletopup");

   var card = obj.CardName;
   card = card.split(' ');
   var iso = card[0];   
    this.router.navigateByUrl('mobiletopup', { state: { pin: obj.Pin, iso:iso } });
   //this.router.navigateByUrl("mobiletopup"); 


  // this.pinnumber  = obj.Pin;
  // this.topup_no   = obj.Pin;
  // this.iso        = iso;
  // this.getInitialTopUpOperatorInfo();
  // this.isTopUpEnable = true; 
  // this.showTopupForm = true;

    
 }
 
  onClickShowMore() {
    this.orderHistoryPage = this.orderHistoryPage + 1;
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.customerService.getFullOrderHistory('topup', this.orderHistoryPage).subscribe(
      (data: OrderHistory[]) => {
      //  console.log('data',data);
        //this.orderHistoryList = data;
        data.map(a => {
          this.orderHistoryList.push(a);
        });
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
  

  /************************/
  ngOnDestroy(): void {
    this.currentSetting$.unsubscribe();
  }

  private getCountries() {
    this.countryService.getAllCountries().subscribe(
      (data: Country[]) => {
        this.allCountry = data;
        if(this.iso !='')
        {
          for (let i = 0; i < data.length; i++) {
           /* if(data[i].iso == this.iso)
           {
            this.onSelectCountrFrom(data[i]);
           }*/
          }
        }
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }


  getInitialTopUpOperatorInfo() {
     
     
    let phoneNumberWithCode: number = this.pinnumber;
    this.getBundlesTopUpInfo();
    this.mobileTopupService.GetMobileTopUp(this.currentSetting.currentCountryId, phoneNumberWithCode).subscribe(
      (data: mobileTopupModel) => {
        console.log("step 1");
        
        if(data && data.OperatorDenominations && data.OperatorDenominations[1])
        {
          this.operatorsList = data.AvaliableOperators;
         // console.log("step 2");
            for (let i = 0; i < this.allCountry.length; i++) 
            {
              if(this.allCountry[i].CountryId ==  data.CountryId)
              {
               // console.log("step 3");
                 
                  this.onSelectCountrFrom(this.allCountry[i]);
                  
                  var length = this.allCountry[i].CountryCode.length;
                  var phone =   parseFloat(this.topup_no.substring(length));
                  //console.log(this.topup_no);
                 // console.log(phone);
                 this.isTopUpEnable = true;
                  this.onClickAmountOption(data.OperatorDenominations[1]);
                  this.mobileTopupForm.patchValue({countryTo:this.allCountry[i] });
                  this.mobileTopupForm.patchValue({ phoneNumber:phone});
                 
                  this.mobileTopupData = data;
                   
              }
          }
          
           
        }
        else
        { 
          this.isTopUpEnable = true;  
        }
      },
      (err: ApiErrorResponse) => {
        console.log(err)
        
      
      },
    );
  }


  radioChange(event) {
    this.amountSent = event.value;
  }

  displayFn(country?: Country): string | undefined {
    return country ? country.CountryName : undefined;
  }

  private _filter(value: any): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  changeNumber() {
    this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
    this.mobileTopupForm.get('phoneNumber').enable();

    // this.mobileTopupForm.patchValue({
    //    phoneNumber: '',
    //   topUpAmount: null
    // });

    this.mobileTopupData = null;
   this.isTopUpEnable = false;
  }
  changeCountry() {
    this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
    this.mobileTopupForm.get('phoneNumber').enable();

    this.mobileTopupForm.patchValue({
      phoneNumber: '',
      countryTo:'',
      topUpAmount: null
    });

    this.mobileTopupData = null;
     this.isTopUpEnable = false;
  }
  getTopUpOperatorInfo() {
    if (!this.mobileTopupForm.valid) {
      return;
    }

    const formValue = this.mobileTopupForm.value;

    const country: Country = formValue.countryTo;
    let phoneNumberWithCode: string = country.CountryCode + formValue.phoneNumber;
    this.mobileTopupService.GetMobileTopUp(this.currentSetting.currentCountryId, phoneNumberWithCode).subscribe(
      (data: mobileTopupModel) => {
        if (isNullOrUndefined(data)) {
          this.mobileTopupForm.get('phoneNumber').setErrors({ Invalid_Operator: true })
          return;
        }
        this.operatorsList = data.AvaliableOperators;
        this.countryTo = data.CountryId;
        this.mobileTopupData = data;
        this.currentOperator = data.Operator;
        this.onClickAmountOption(this.mobileTopupData.OperatorDenominations[1]) ;
        this.isTopUpEnable = true;
        this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
        this.mobileTopupForm.get('phoneNumber').disable();

        this.getBundlesTopUpInfo()
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  
  get operatorImage() {
    return `assets/images/operators/${this.mobileTopupData.Operator.toLowerCase()}.png`;
  }

  get buttonText() {
    if (!this.isTopUpEnable) {
      return 'Submit';
    } else {
      return 'Checkout';
    }
  }
  getChecked(amt:number)
  {
    if(this.mobileTopupForm.get('topUpAmount').value)
    {
      if( amt == this.mobileTopupForm.get('topUpAmount').value.UsDenomination)
      {
        return 'selected';
      }
      else{
        return '';
      }
    }
  else
    return false;
  }
  onClickAmountOption(item: any) {
    
    this.mobileTopupForm.get('topUpAmount').setValue(item);
    this.isTopUpEnable = true;
     
  }
  buyNow(item: any)
  {

    
    this.mobileTopupForm.get('topUpAmount').setValue(item);
    this.isTopUpEnable = true;
    this. onMobileTopupFormSubmit();
  }

  onMobileTopupFormSubmit() {
    // stop here if form is invalid
    if (!this.isTopUpEnable) {
      this.getTopUpOperatorInfo();
      return;
    }
    this.validateAmountSelection();
    if (!this.mobileTopupForm.valid) {
      return;
    }
    
    const checkoutModel: MobileTopupCheckoutModel = new MobileTopupCheckoutModel();

    checkoutModel.transactiontype = TransactionType.Topup;
    checkoutModel.country = this.mobileTopupForm.get('countryTo').value as Country; // this.autoControl.value.countryTo as Country;
    checkoutModel.topupOption = this.mobileTopupForm.value.topUpAmount as OperatorDenominations;
    checkoutModel.currencyCode = this.currentSetting.currency;
    //checkoutModel.phoneNumber = this.mobileTopupForm.get("countryTo").value?.CountryCode+' '+this.mobileTopupForm.get('phoneNumber').value;
    checkoutModel.phoneNumber = this.mobileTopupForm.get('phoneNumber').value;
    checkoutModel.operatorCode = this.mobileTopupData.OperatorCode;
    checkoutModel.countryFrom = this.currentSetting.currentCountryId;
    checkoutModel.isHideCouponEdit = true;
    this.checkoutService.setCurrentCart(checkoutModel);
    this.showCreditCards()
   
  }

  validateAmountSelection() {
    if (!this.isTopUpEnable) {
      return false;
    }
    const amount = this.mobileTopupForm.get('topUpAmount').value;
    if (isNullOrUndefined(amount)) {
      this.mobileTopupForm.get('topUpAmount').setErrors({ Amount_Req: true })
      return false
    }

    return true;
  }
  
  onSelectCountrFrom(country: Country) {
    
  this.countryName = country.CountryName;

	this.mycountryId= country.CountryId; 


  } 
  
  storePhoneNumber = () =>{
    let phone = this.mobileTopupForm.get('phoneNumber').value;
    
   
  }

  unsetFlag() {
    
    
	this.mycountryId= -1; 
  }
  
  setOperator(obj)
  {
    this.mobileTopupData.Operator = obj;
    this.showOperators = false;
    this.currentOperator = obj;
    this.getOperatorDenominations();
    this.getBundlesTopUpInfo();

  }
  get_optr_image(obj)
  {
    return `assets/images/operators/${obj.toLowerCase()}.png`;
  }

  changeOperator()
  {
    this.showOperators = true;
  }
  getOperatorDenominations()
  {
    this.mobileTopupService.getOperatorsDenomination(this.currentSetting.currentCountryId, this.countryTo, this.currentOperator).subscribe(  (data: any) =>{
      if(data)
      {
        this.mobileTopupData.OperatorDenominations = data;
        this.topupOperators = data.AvaliableOperators;
        this.onClickAmountOption(this.mobileTopupData.OperatorDenominations[1]) ;
      }
      
    })
  }

  showDetailTopup()
  {
    const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.panelClass = 'topup-plan-dialog'
        dialogConfig.minHeight = "500px";
        dialogConfig.width = "700px";
        dialogConfig.data={from_id:this.currentSetting.currentCountryId, to_id:this.countryTo, operator:this.currentOperator}
      this.dialog.open(TopupDialogComponent,dialogConfig);
  }

/********** Bundles functionality*****************/
  getBundlesTopUpInfo(){
    this.mobileTopupService.getBundlesTopUp2(this.currentSetting.currentCountryId, this.countryTo, this.currentOperator+' Bundle').subscribe(data =>{
      if(data){
         this.bundleInfo = data;

      }
    })
  }

  getFilterdArr(desc:String)
  {
    return desc.split(' ^ ');
  }
  buyBundle(item)
  {
    let productId = item.ProductId;

   let new_item = this.bundleInfo.topupOperators.filter(a=> a.ProductId == productId)
   
    //console.log('new_item[0]', new_item[0]);
    this.buyNow(new_item[0]);
  }
  /**********************/
  
  showCreditCards()
  {
    this.showCredicard = !this.showCredicard;
  }


  
  onPaymentInfoFormSubmit(creditCard: CreditCard) {
   
    // this.getCurrentCarts(creditCard);
     
   }
 
   onPaymentButtonTrigger(creditCard: CreditCard) {
     this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
       if (model === null ) {
         creditCard = null;
          return false;
       }
       else
       {
             this.currentCart = model;
          // console.log('Your model is as ', model);
           this.onCreditCardPayment(creditCard);
       }
       
        
       
     }, err => {
     }, () => {
       this.checkoutService.deleteCart();
     })
   }
 
   /**
    * On credit card payment Option.
    */

   private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
     let trans_type = '';
     if(creditCard)
     {
       localStorage.setItem('selectedCard',  creditCard.CardId.toString());
       let planOrderInfo: ICheckoutOrderInfo;
 
       planOrderInfo = new MobileTopupOrderInfo();
       trans_type = 'Topup';
  
   
 
       planOrderInfo.creditCard = creditCard;
       planOrderInfo.checkoutCart = this.currentCart;
  
 
       
         var first_fivenum = creditCard.CardNumber.substring(0, 5);
         this.braintreeService.testProcess(first_fivenum, trans_type).subscribe( (data: ApiProcessResponse)=>{ 
         this.paymentProcessor = data.ThreeDSecureGateway; 
 
         
           if(data.Use3DSecure)
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
           else
           {
             /********** Use3DSecure :false  then process transaction directly **********/
             let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
             let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
            }
         });
       
    }
   }
 
   goBack()
   {
    this.showTopupForm = !this.showTopupForm;
   }

   
}