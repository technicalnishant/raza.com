import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditCardValidators } from 'angular-cc-library';
import { Observable } from 'rxjs/internal/Observable';
//import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';

import { CountriesService } from '../../../core/services/country.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CustomerService } from '../../../accounts/services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { AuthenticationService } from '../../../core/services/auth.service';

import { State, BillingInfo } from '../../../accounts/models/billingInfo';
import { CodeValuePair } from '../../../core/models/codeValuePair.model';
import { Country } from '../../../shared/model/country';
import { ICheckoutModel, NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../models/transaction-request.model';
import { CreditCard } from '../../../accounts/models/creditCard'; //BraintreeCard
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';

import { AddCreditcardDialog } from '../../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { AddCreditcardPayDialog } from '../../../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

import { isNullOrUndefined } from "../../../shared/utilities";
import { TransactionService } from '../../../payments/services/transaction.service';
import { BraintreeService } from '../../../payments/services/braintree.service';
import { BraintreeCard } from '../../../accounts/models/braintreeCard';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as braintree from 'braintree-web';


import { ViewChild, AfterViewInit, NgZone} from '@angular/core';
 import { Subscription } from 'rxjs';
 import { CurrentSetting } from '../../../core/models/current-setting';

 import { CheckoutService } from '../../../checkout/services/checkout.service';

@Component({
  selector: 'app-no-card-payment-box',
  templateUrl: './no-card-payment-box.component.html',
  styleUrls: ['./no-card-payment-box.component.scss']
})
export class NoCardPaymentBoxComponent implements OnInit, AfterViewInit {
/********** Google place search **********/
@Input() adressType: string;
@Output() setAddress: EventEmitter<any> = new EventEmitter();
@ViewChild('addresstext') addresstext: any;

autocompleteInput: string;
queryWait: boolean;

address: Object;
establishmentAddress: Object;
formattedAddress: string;
formattedEstablishmentAddress: string;
phone: string;
search_country:any='US';
  search_country_id:any=1;
/**********EOF Google place search **********/
  paymentInfoForm: FormGroup;
  existingCreditCardForm: FormGroup;
  currentCountry: Country;
  countries: Country[]
  countrysFrom:Country[]
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
  @Input() checkOutModel: ICheckoutModel;
  @Output() onPaymentSubmit = new EventEmitter<CreditCard>();
  paymentSubmitted: boolean;
  countryFlagCss: string;
  showDropdown: boolean = false;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  currentCurrency:any;
  currentCart: ICheckoutModel;
  isPromotion:boolean = true;
  constructor(
    public zone: NgZone,
    private transactionService: TransactionService, 
    private braintreeService: BraintreeService,
    private formBuilder: FormBuilder,
    private countryService: CountriesService,
    private razaEnvService: RazaEnvironmentService,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private razaSnackbarService: RazaSnackBarService,
    private authService: AuthenticationService,
    private httpClient: HttpClient,
    private checkoutService: CheckoutService,
  ) { }
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    //this.getPlaceAutocomplete();
  }
   
  ngOnInit() {

    this.paymentInfoForm = this.formBuilder.group({
      cardNumber: [''],
      validFrom: [''],
      validTo: [''],
      cvv: [''],
      firstName: ['', [Validators.required]],
       
      lastName: [''], 
      email: ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      address: ['' ],
      zipcode: ['' ],
      city: ['' ],
      country: [this.countryFromId],
      isAutRefill: [{ value: this.checkOutModel.isAutoRefill, disabled: true }],
      state: [''],
      phoneNumber: ['', [Validators.required]],
    });
    this.search_country_id = this.countryFromId ;
    this.existingCreditCardForm = this.formBuilder.group({
      creditCards: this.formBuilder.group([])
    });
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
     
    if (this.checkOutModel instanceof NewPlanCheckoutModel) {
      const cart = this.checkOutModel as NewPlanCheckoutModel;
      this.countryFromId = cart.countryFrom;

      
      //this.paymentInfoForm.get('country').disable();

    }
    
    this.getFromCountries()
   // this.onCountryChange(this.countryFromId);
    this.getBillingInfo();
    //this.getCustomerCards();
    //this._initAutoRefillTooltip();
	  //this.removeLocalStorage();
    this.getCountryFrom();
  }
 
  getFromCountries() {
     
    this.countryService.getFromCountries().subscribe(
      (res: Country[]) => {
        const cart = this.checkOutModel as NewPlanCheckoutModel;
        //const cart: NewPlanCheckoutModel = this.currentCart as NewPlanCheckoutModel;
       
        this.currentCountry = res.find(a => a.CountryId === cart.countryFrom);
        this.countryFlagCss = `flag flag-f-${this.currentCountry.CountryId}`
       
      });
  }
  closeFlagDropDown() {
    this.showDropdown = false;
  }
  onSelectCountrFrom(country: Country) {
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
 
    this.closeFlagDropDown();
    this.setcurrentCurrency();
  }
  setcurrentCurrency()
  {
    if(this.currentSetting.country.CountryId == 1)
      this.currentCurrency='USD';
      if(this.currentSetting.country.CountryId == 2)
      this.currentCurrency='CAD';
      if(this.currentSetting.country.CountryId == 3)
      this.currentCurrency='GBP';
      if(this.currentSetting.country.CountryId == 8)
      this.currentCurrency='AUD';
      if(this.currentSetting.country.CountryId == 20)
      this.currentCurrency='NZD';
      if(this.currentSetting.country.CountryId == 26)
      this.currentCurrency='INR';
      
      
      
       
  }
  openFlagDropDown() {

    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
    console.log(this.countrysFrom);
  }
  removeLocalStorage()
  {
    localStorage.removeItem('selectedCard');
    localStorage.removeItem('errorCode');
    localStorage.removeItem('selectedCvv');
  }
 
  private _initAutoRefillTooltip() {
    if (this.checkOutModel.isMandatoryAutorefill) {
      this.autoRefillTipText = `This plan recharges automatically when your balance falls below $2. Call customer service tocancel anytime.`
    } else {
      this.autoRefillTipText = 'Automatically add $10 to my account when my balance falls below $2.'
    }
  }

  isDisplayCvvRequired(item: CreditCard): boolean {
    return this.selectedCard.CardId === item.CardId && item.Cvv.length === 0 && this.paymentSubmitted;
  }
  get isEnableAutoRefillOption() {
    if (this.checkOutModel.transactiontype === TransactionType.Sale || this.checkOutModel.transactiontype === TransactionType.Activation) {
      return true;
    }
    return false;
  }

  get isFreeStateText() {
    return isNullOrUndefined(this.states) || this.states.length === 0;
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

  getCustomerCards() {
    this.customerService.getSavedCreditCards().toPromise().then(
      (res: CreditCard[]) => {
        if (res.length > 0) {
          this.customerSavedCards = res.splice(0, 2);
		 
          this.selectedCardPay=this.customerSavedCards[0];
          console.log(this.selectedCardPay);
          this.selectedCard = this.selectedCardPay;
          //localStorage.setItem('card':{card:this.selectedCardPay.CardId, selectedCard:this.selectedCardPay.Cvv});
         
         
         

          this.loadBillingInfo();
		  //this.onClickCreditCardPay();
        } else {
          this.getCreditCardValidityOptions();
          this.getBillingInfo();
          this.havingExistingCard = false;
		  //this.onClickCreditCardPay();
        }
		
      });
  }

  
  
  onClickCreditCardPayment() {
    this.paymentSubmitted = true;
    if (this.selectedCard === null)
      return;
    if (this.selectedCard.Cvv.length < 3)
      return;

    this.selectedCard.CardHolderName = `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`;
    this.selectedCard.FullName = this.selectedCard.CardHolderName;
    this.selectedCard.PhoneNumber = this.billingInfo.Address.HomePhone;
    this.onPaymentSubmit.emit(this.selectedCard);
  }
  
  onPaymentInfoFormSubmit() {
    console.log(this.paymentInfoForm);
    if (!this.paymentInfoForm.valid) {
      console.log("Invalid");
      return;
    }
    const formValues = this.paymentInfoForm.value;
    var name = formValues.firstName;
    name = name.trim();
    let parts = name.split(' ')
     
    let firstName = parts.shift();  // Paul
    let lastName = parts.join(' '); 
   
    formValues.firstName = firstName;
    formValues.lastName = (lastName !='')?lastName:firstName ;
    
     
    //https://restapi.razacomm.com/api/AccessNumbers/Instance/OAF0685D0485
    //https://restapi.razacomm.com/api/Customers/BillingInfo
    this.updateBillingInfo().toPromise().then(res => {
      let creditCard: CreditCard = {
        CardId: 0,
        CardNumber: (formValues.cardNumber as string).replace(/\s/g, ''),
        CardType: '',
        //ExpiryDate: null,
        //ExpiryDate: formValues.validFrom+"/"+formValues.validTo,
        ExpiryDate: formValues.validFrom+formValues.validTo,
        ExpiryMonth: formValues.validFrom,
        ExpiryYear: formValues.validTo,
        Cvv: formValues.cvv,
        Status: true,
        CardHolderName: `${formValues.firstName} ${formValues.lastName}`,
        IsPrimary: true,
        FullName: `${formValues.firstName} ${lastName}`,
        Country: this.billingInfo.Address.Country.CountryId.toString(),
        State: formValues.state,
        BillingAddress: formValues.address,
        City: formValues.city,
        PostalCode: formValues.zipcode,
        PhoneNumber: formValues.phoneNumber
      }
 console.log(creditCard);
		  this.onPaymentSubmit.emit(creditCard);
  });
    
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

  getCreditCardValidityOptions() {
    this.years = this.razaEnvService.getYears();
    this.months = this.razaEnvService.getMonths();
  }

  onCountryChange(country: number): void {
   /* this.search_country_id = country;
    this.countryService.getStates(country).subscribe(
      (res: State[]) => {
        this.states = res;
      }
    )*/
  }

  /* get countries from. */
  getCountryFrom(): void {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countrysFrom = res;
      
     // this.countries = res.splice(0, 3);
      
    })
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

        const billInfo = 
        {
          firstName: res.FirstName+" "+res.LastName,
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
        this.paymentInfoForm.patchValue(billInfo);
      })
  }

  private updateBillingInfo(): Observable<boolean | ApiErrorResponse> {
    const formValues = this.paymentInfoForm.value;
    var state = '';
    var zip = '';
    var city = '';
    if(this.billingInfo.Address.Country.CountryId == 1)
    {
      state = 'IL';
      zip = '00000';
    }
    
    if(this.billingInfo.Address.Country.CountryId == 2)
    {
      state = 'ON';
      zip = 'M9V 1A6';
       
    }

    /*
    var fullName = formValues.firstName;
    var name = formValues.firstName;
    name = name.trim();
    let parts = name.split(' ')
    let firstName = parts.shift();  // Paul
    let lastName = parts.join(' '); 
     
    formValues.firstName = firstName;
    formValues.lastName = lastName;*/
    console.log(formValues.lastName);
    localStorage.setItem("login_no", formValues.phoneNumber);
    const billingInfo = {
      FirstName: formValues.firstName,
      LastName: formValues.lastName,
      Email:formValues.email,
      StreetAddress: 'FreeTrial',
      City: 'FreeTrial',
      State: state,
      CountryId: this.billingInfo.Address.Country.CountryId,
      ZipCode: zip,
      PhoneNumber: formValues.phoneNumber,
      ReferrerEmailId: ''
    };
   
    return this.customerService.SaveCustomerBillingInfo(billingInfo);
  }

  editCardDetails(card) {
    this.removeLocalStorage();
    this.customerService.EditCreditCard(card).subscribe(data => {
      
      this.cardBillingAddress(data);
    });
  }

  cardBillingAddress(data) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: data,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
	 
	this.cvvStored=result.split(",")[1];
	
     // if (result == "success") {
      if (result.split(",")[0] == "success") {
	 
        this.getCustomerCards();
        //this.loadBillingInfo();
        //this.onClickCreditCardPay();
         
        this.customerService.GetBillingInfo().subscribe(
          (res: any) => { this.billingInfo = res;
          
            this.onClickCreditCardPay();
          },
          (err: ApiErrorResponse) => console.log(err),
        ) 
        
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )

  }

  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res;
     /* if(res.Email && res.Email !='')
      {
        var user_email = res.Email;
        if(user_email.includes("@raza.temp"))
        {
          this.billingInfo.Email = '';
        }
      }*/
       // this.onClickCreditCardPay();
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  addNewCard() {
    this.removeLocalStorage();
    const dialogRefCard = this.dialog.open(AddCreditcardPayDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: null,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
      this.cvvStored=result.split(",")[1];
      
      if (result.split(",")[0] == "success") {
        this.getCustomerCards();
        //this.loadBillingInfo();

         
          this.customerService.GetBillingInfo().subscribe(
            (res: any) => { this.billingInfo = res;
            
              this.onClickCreditCardPay();
            },
            (err: ApiErrorResponse) => console.log(err),
          )
         

       // this.onClickCreditCardPay();
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

  onClickCreditCardPay() {
    this.paymentSubmitted = true;
    this.selectedCardPay.CardHolderName = `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`;
    this.selectedCardPay.FullName = this.selectedCardPay.CardHolderName;
    this.selectedCardPay.PhoneNumber = this.billingInfo.Address.HomePhone;
    this.selectedCardPay.Cvv= this.cvvStored;
    
    this.onPaymentSubmit.emit(this.selectedCardPay);
  }

  editModal()
  {
    
    //this.loadBillingInfo(cardId);
    var cardId = parseInt(localStorage.getItem('selectedCard'), 10);
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res;
      
          this.customerService.EditCreditCardbyId(cardId).subscribe(data => {
        
            this.cardBillingAddress(data);
          });
        },
      (err: ApiErrorResponse) => console.log(err),
    )
     this.loadBillingInfo();
  }
   
   /********************/

}

