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
@Component({
  selector: 'app-moto',
  templateUrl: './moto.component.html',
  styleUrls: ['./moto.component.scss']
})
export class MotoComponent implements OnInit {
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
          phone:this.userToken,
          captcha: ''
        };
     
        this.authService.loginwToken(body, false, "Y").subscribe((response) => {
           if (response != null) {
           this.getMotoInfo();  
          }  
        },
        (error) => {
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
    this.motoService.generateMotoOrder(this.userToken).subscribe(res => {
      console.log(res);
      
     //"TransactionType": "recharge"
    
      this.buyPlan(res);
      /*********
       * If TransactionType == recharge then it should call recharge 
       * +
       * model.ProcessedBy = plan.InitiatedBy; is required all the time
       * 
       * *********/
     //  if(res){this.userData = res};
      //this.getActivePromotion(this.currentSetting.currentCountryId);
    })
  }

  buyPlan(plan) {

    localStorage.setItem('IsMoto', 'yes'); 
    localStorage.setItem('InitiatedBy', plan.InitiatedBy);
    localStorage.setItem('moto_orderid', plan.OrderId);

    this.search_country_id = plan.CountryFrom;
    this.order_amount = plan.PurchaseAmount;
    this.currency_code = plan.CurrencyCode;

  if(plan.TransactionType == 'recharge')
  {
    this.rechargeNow(plan);
  }
  else
  { 
    
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
    this.exCardNumber = (plan.CreditCardInfo.CardNumber)?plan.CreditCardInfo.CardNumber:0;
    model.CardId = plan.CardId;
    model.CardName = plan.CardName;
    model.CurrencyCode = plan.CurrencyCode;
    model.details = {
      Price: plan.PurchaseAmount,
      ServiceCharge: plan.ServiceChargePercent ? plan.ServiceChargePercent : 0,
      SubCardId: plan.SubCardId
    }
    model.ProcessedBy = plan.InitiatedBy;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = plan.CountryFrom;
    model.countryTo = plan.CountryTo;
    model.couponCode = '';
    model.currencyCode = plan.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.couponCode = plan.CouponCode;
    model.isCalculatedServiceFee = false;
    model.isAutoRefill = false;
    model.isMandatoryAutorefill = false;
    model.isHideCouponEdit = !plan.IsEditCoupon;
    model.pinlessNumbers = [''];
    this.checkoutService.setCurrentCart(model);
   
    this.getCustomerCards();
  } 
  }

  rechargeNow(plan){
    console.log("Recharge Now");

    const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    model.purchaseAmount = plan.PurchaseAmount;
    model.couponCode = plan.CouponCode;
    model.currencyCode = plan.CurrencyCode;
    model.cvv = '';
    model.ProcessedBy = plan.InitiatedBy;
    model.planId = plan.OriginalOrderId
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = plan.ServiceChargePercent;
    model.planName = plan.CardName;
    model.countryFrom = plan.CountryFrom;
    model.countryTo = plan.CountryTo;
    model.cardId = plan.CardId;
    model.isAutoRefill = false; /***** If we get value from api we need to pass it as it is *********/
	  model.offerPercentage = ''; 
    model.isCalculatedServiceFee = true;
    this.checkoutService.setCurrentCart(model);

    
    this.getCustomerCards();
  }

  getCreditCardValidityOptions() {
    this.years = this.razaEnvService.getYears();
    this.months = this.razaEnvService.getMonths();
  }
  getCustomerCards() {
    this.customerService.getSavedCreditCards().toPromise().then(
      (res: CreditCard[]) => {
        if (res.length > 0) {
          this.customerSavedCards = res.splice(0, 1);
          this.havingExistingCard = true;
          this.selectedCardPay = this.customerSavedCards[0];
           
          this.selectedCard = this.selectedCardPay;
          //localStorage.setItem('card':{card:this.selectedCardPay.CardId, selectedCard:this.selectedCardPay.Cvv});
           
          //this.exCardNumber
         

          //this.loadBillingInfo();
          this.getBillingInfo()
        } else {
          this.getCreditCardValidityOptions();
          this.getBillingInfo();
          this.havingExistingCard = false;

        }
		
      });
  }

  getCardIcon(CreditCard: CreditCard) {
    switch (CreditCard.CardType.toLowerCase()) {
      case 'visa':
        return 'https://d2uij5nbaiduhc.cloudfront.net/images/visa_card.png';
        break;
      case 'mastercard':
        return 'https://d2uij5nbaiduhc.cloudfront.net/images/master-card.png';
        break;
      case 'discover':
        return 'https://d2uij5nbaiduhc.cloudfront.net/images/discover-card.png';
        break;
      case 'amex':
        return 'https://d2uij5nbaiduhc.cloudfront.net/images/american-card.png';
        break;
      default:
        break;
    }
  }

  isDisplayCvvRequired(item: CreditCard): boolean {
    return this.selectedCard.CardId === item.CardId && item.Cvv.length === 0 && this.paymentSubmitted;
  }

  onCountryChange(country: number): void {
    this.search_country_id = country;
    this.countryService.getStates(country).subscribe(
      (res: State[]) => {
        this.states = res;
      }
    )
  }
  getBillingInfo() {
    this.customerService.GetBillingInfo().toPromise().then(
      (res: BillingInfo) => {
        if (res.Address) {
          this.onCountryChange(res.Address.Country.CountryId)

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
        this.billingInfoForm.patchValue({
          FullName: res.FirstName + " " + res.LastName,
          Country: res.Address.Country.CountryId,
          State: res.Address.State,
          BillingAddress: res.Address.StreetAddress,
          City: res.Address.City,
          PostalCode: res.Address.ZipCode,
        });
        this.paymentPhone = res.Address.HomePhone;
        this.search_country_id = res.Address.Country.CountryId;
        
      })
  }

  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res;
 
        this.billingInfoForm.patchValue({
          FullName: res.FirstName + " " + res.LastName,
          Country: res.Address.Country.CountryId,
          State: res.Address.State,
          BillingAddress: res.Address.StreetAddress,
          City: res.Address.City,
          PostalCode: res.Address.ZipCode,
        });
        this.paymentPhone = res.Address.HomePhone;
        this.search_country_id = res.Address.Country.CountryId;
 
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
    
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }
  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }
  handleInvalidCouponCodeError() {
    let error = new ErrorDialogModel();
    error.header = 'Invalid Coupon Code';
    error.message = 'Please check your information and try again.';

    this.currentCart.isHideCouponEdit = false;
    this.currentCart.couponCode = null;

    this.openErrorDialog(error);
  }

  validateCoupon(req: ValidateCouponCodeRequestModel): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    return this.transactionService.validateCouponCode(req).toPromise();
  }
  
  /**
   * On credit card payment Option.
   */
  

   onClickCreditCardPayment() {
    this.paymentSubmitted = true;
    if (this.selectedCard === null)
      return;
    if (this.selectedCard.Cvv.length < 3)
      return;

    this.selectedCard.CardHolderName = `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`;
    this.selectedCard.FullName = this.selectedCard.CardHolderName;
    this.selectedCard.PhoneNumber = this.billingInfo.Address.HomePhone;
     
    this.onCreditCardPayment(this.selectedCard);
  }
  

  
 
  onPaymentInfoFormSubmit() {
    console.log(this.paymentDetailForm);
    if (!this.paymentDetailForm.valid) {
      console.log("Invalid");
      return;
    }
    const formValues = this.paymentDetailForm.value;
    const personValues = this.billingInfoForm.value;
     
      let creditCard: CreditCard = {
        CardId: 0,
        CardNumber: (formValues.CardNumber as string).replace(/\s/g, ''),
        CardType: '',
        //ExpiryDate: null,
        //ExpiryDate: formValues.validFrom+"/"+formValues.validTo,
        ExpiryDate: formValues.ExpMonth+formValues.ExpYear,
        ExpiryMonth: formValues.ExpMonth,
        ExpiryYear: formValues.ExpYear,
        Cvv: formValues.Cvv2,
        Status: true,
        CardHolderName: personValues.FullName,
        IsPrimary: true,
        FullName: personValues.FullName,
        Country: personValues.Country,
        State: personValues.State,
        BillingAddress: personValues.BillingAddress,
        City: this.billingInfo.Address.City,
        PostalCode: this.billingInfo.Address.ZipCode,
        PhoneNumber: this.billingInfo.Address.HomePhone
      }
      //console.log(this.billingInfo.Address.HomePhone);
      //console.log(creditCard);
      //return false;

      this.saveAndGetCard(creditCard).toPromise()
          .then(res => {
            this.customerService.getSavedCreditCards().toPromise().then((cr: CreditCard[]) => {
              creditCard.CardId = cr[0].CardId;
              this.onCreditCardPayment(creditCard);
            })
          })
       
    
  }
  saveAndGetCard(creditCard: CreditCard) {

    let body = {
      CardNumber: creditCard.CardNumber,
      Cvv2: creditCard.Cvv,
      ExpMonth: creditCard.ExpiryMonth,
      ExpYear: creditCard.ExpiryYear,
      NameOnCard: creditCard.CardHolderName,
      Country: this.billingInfo.Address.Country.CountryId,
      BillingAddress: creditCard.BillingAddress,
      Email: this.billingInfo.Email,
      City: creditCard.City,
      State: creditCard.State,
      ZipCode: creditCard.PostalCode
    }

    // return this.customerService.SaveCreditCard(body).map(res => {
    // });
    return this.customerService.SaveCreditCard(body).pipe();
  }
 
   private onCreditCardPayment(creditCard: CreditCard, aniNumbers?: string[]) {
     
    
    this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      //this.checkoutService.getCurrentCart().subscribe(res => {
        this.currentCart = model;
        console.log(this.currentCart);
    })
    if (this.currentCart.transactiontype === TransactionType.Activation) {
      const cart = this.currentCart as NewPlanCheckoutModel;
      cart.pinlessNumbers = [creditCard.PhoneNumber];
      cart.ProcessedBy = localStorage.getItem('InitiatedBy');

      
    }
    const planOrderInfo: ICheckoutOrderInfo = {
      creditCard: creditCard,
      checkoutCart: this.currentCart
    }
     
    
       if(planOrderInfo.checkoutCart.couponCode == 'FREETRIAL')
      {

         
        let service: TransactionProcessBraintreeService = this.transactionProcessBraintree;
        let checkoutInfo = this.transactionService.processPaymentNormal(planOrderInfo);
        
      }
      else
      { 

      var trans_type = this.currentCart.transactiontype;
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
    
  }

}
