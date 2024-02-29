import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreditCardValidators } from 'angular-cc-library';
import { Observable } from 'rxjs/internal/Observable';
//import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';

import { CountriesService } from '../../core/services/country.service';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CustomerService } from '../../accounts/services/customerService';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { AuthenticationService } from '../../core/services/auth.service';

import { State, BillingInfo } from '../../accounts/models/billingInfo';
import { CodeValuePair } from '../../core/models/codeValuePair.model';
import { Country } from '../../shared/model/country';
import { ICheckoutModel, NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { CreditCard } from '../../accounts/models/creditCard'; //BraintreeCard
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';

import { AddCreditcardDialog } from '../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { AddCreditcardPayDialog } from '../../accounts/dialog/add-creditcard-pay-dialog/add-creditcard-pay-dialog';

import { isNullOrUndefined } from "../../shared/utilities";
import { TransactionService } from '../../payments/services/transaction.service';
import { BraintreeService } from '../../payments/services/braintree.service';
import { BraintreeCard } from '../../accounts/models/braintreeCard';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as braintree from 'braintree-web';

import {FormControl}  from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BottomUpComponent } from '../dialog/bottom-up/bottom-up.component';
import { ViewChild, AfterViewInit, NgZone} from '@angular/core';

import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

 import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-credit-card',
  templateUrl: './new-credit-card.component.html',
  styleUrls: ['./new-credit-card.component.scss']
})
export class NewCreditCardComponent implements OnInit, AfterViewInit {
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
  billingInfoForm: FormGroup;
  existingCreditCardForm: FormGroup;
  selectepage:number=0;
  countries: Country[]
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
  cardId:number;
  cardSubmitted:boolean=false;
  addSubmitted:boolean=false;
  @Input() checkOutModel: ICheckoutModel;
  @Output() onPaymentSubmit = new EventEmitter<CreditCard>();
  paymentSubmitted: boolean;
  public selectedIndex: number=0;
   cardClicked:boolean = false;
  constructor(
    private _bottomSheet: MatBottomSheet,
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
  ) { }
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    //this.getPlaceAutocomplete();
  }
   
  ngOnInit() {
    
    this.paymentInfoForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required,CreditCardValidators.validateCCNumber]],
      validFrom: ['', [Validators.required]],
      validTo: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
     /* firstName: ['', [Validators.required]],
       
      lastName: ['', [Validators.required]], 
      email: ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      address: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: [this.countryFromId, [Validators.required]],
      isAutRefill: [{ value: ''}],
      state: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],*/
    });
     
    this.billingInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]], 
      email: ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      address: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: [this.countryFromId, [Validators.required]],
      isAutRefill: [{ value: ''}],
      state: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });


    this.search_country_id = this.countryFromId ;
    this.existingCreditCardForm = this.formBuilder.group({
      creditCards: this.formBuilder.group([])
    });

    if (this.checkOutModel instanceof NewPlanCheckoutModel) {
      const cart = this.checkOutModel as NewPlanCheckoutModel;
      this.countryFromId = cart.countryFrom;
      this.paymentInfoForm.get('country').disable();

    }

    this.getCountryFrom();
    this.onCountryChange(this.countryFromId);
    this.getCustomerCards();
    
    this.paymentProcessor = 'Cardinal'
    //this.checkPaymentProcess();
    //this.getBraintreeToken();
    this.removeLocalStorage();
  }
  get cf() { return this.paymentInfoForm.controls; }
  get af() { return this.billingInfoForm.controls; }
  validateCard()
  {
     
    this.cardSubmitted = true;
    this.cardClicked = false;
    if (this.paymentInfoForm.invalid) {
      return false;
    }
  }
  stepChange(event){
    this.selectedIndex= event.selectedIndex;
    
}
  removeLocalStorage()
  {
    localStorage.removeItem('selectedCard');
    localStorage.removeItem('errorCode');
    localStorage.removeItem('selectedCvv');
  }

  getBraintreeToken()
  {
    //this.braintreeService.getBraintreeToken().subscribe(data => this.braintreeToken = data);
  } 
  checkPaymentProcess(){
   // this.braintreeService.testProcess().subscribe(data => this.paymentProcessor = data);
  };

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
     
          this.getCreditCardValidityOptions();
          this.getBillingInfo();
          this.havingExistingCard = false;
		  
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
    this.addSubmitted = true;
     
    if (!this.billingInfoForm.valid) {
      console.log("Invalid");
      return;
    }

    const formValues = this.paymentInfoForm.value;
    const addformValues = this.billingInfoForm.value;
    
    
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
        CardHolderName: `${addformValues.firstName} ${addformValues.lastName}`,
        IsPrimary: true,
        FullName: `${addformValues.firstName} ${addformValues.lastName}`,
        Country: this.billingInfo.Address.Country.CountryId.toString(),
        State: addformValues.state,
        BillingAddress: addformValues.address,
        City: addformValues.city,
        PostalCode: addformValues.zipcode,
        PhoneNumber: addformValues.phoneNumber
      }

      if (this.checkOutModel.transactiontype === TransactionType.MR) {
        this.saveAndGetCard(creditCard).toPromise()
          .then(res => {
            this.razaSnackbarService.openSuccess("Credit card saved successfully.");
            this.customerService.getSavedCreditCards().toPromise().then((cr: CreditCard[]) => {
              creditCard.CardId = cr[0].CardId;
              this.onPaymentSubmit.emit(creditCard);
            })
          })
      } else {
        this.onPaymentSubmit.emit(creditCard);
      }
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
    this.search_country_id = country;
    this.countryService.getStates(country).subscribe(
      (res: State[]) => {
        this.states = res;
      }
    )
  }

  /* get countries from. */
  getCountryFrom(): void {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countries = res.splice(0, 3);
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
        this.paymentInfoForm.patchValue(billInfo);
      })
  }

  private updateBillingInfo(): Observable<boolean | ApiErrorResponse> {
    
    const formValues = this.billingInfoForm.value;
     
    const billingInfo = {
      FirstName: formValues.firstName,
      LastName: formValues.lastName,
      Email:formValues.email,
      StreetAddress: formValues.address,
      City: formValues.city,
      State: formValues.state,
      CountryId: this.billingInfo.Address.Country.CountryId,
      ZipCode: formValues.zipcode,
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


   whatiscvv()
   {
    this._bottomSheet.open(BottomUpComponent);
   /* const dialogRef = this.dialog.open(BottomUpComponent, {
      data: {
        success: 'success'
      }
    });*/
     
   }
   card_error_check()
   {
    //console.log("type char is "+this.paymentInfoForm.get('cardNumber').value);
    this.cardClicked = true;
   // var card_type = this.GetCardType(this.paymentInfoForm.get('cardNumber').value);
    //console.log(card_type);
    
   }

GetCardType(number:any)
{
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
        return "Visa";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
     if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
        return "Mastercard";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
        return "AMEX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
        return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
        return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
        return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
        return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
        return "Visa Electron";

    return "";
}
   getPlaceAutocomplete() {
     
    if(this.search_country_id == 1)
    {
      this.search_country = 'US';
    }
    if(this.search_country_id == 2)
    {
      this.search_country = 'CA';
    }
    if(this.search_country_id == 3)
    {
      this.search_country = 'UK';
    }
    if(this.search_country_id == 8)
    {
      this.search_country = 'AU';
    }
    if(this.search_country_id == 20)
    {
      this.search_country = 'NZ';
    }
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
        {
            componentRestrictions: { country: this.search_country },
            types: ['address']  // 'establishment' / 'address' / 'geocode'
        });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        const place = autocomplete.getPlace();
        this.getAddress(place);
    });
  }
  
  
   getAddress(place: object) {
    this.address = place['formatted_address'];
    this.phone = this.getPhone(place);
    this.formattedAddress = place['formatted_address'];
    this.zone.run(() => this.formattedAddress = place['formatted_address']);
  
    console.log(place);
    var street      =  this.getStreet(place) ; 
    var street_no   = this.getStreetNumber(place); 
    var post_code   = this.getPostCode(place)
    var city        = this.getCity(place);
    var state       = this.getState(place);
    if(street_no !== 'undefined')
    {

    }
    else{
      street_no = '';
    }
    
    
  //console.log(street+" "+street_no+" "+post_code+" "+city+" "+state);
  var state_id = '';
  
   
  if(this.states[0])
  {
    for(var i=0; i< this.states.length; i++)
    {

      if(this.states[i].Id == state )
      {
        state_id = this.states[i].Id;
      }
       
    }
  
  }
  if(this.search_country == 'UK')
  {
    state_id      = '1';
  }
   
      
  const billInfo = {
     
    address: street_no+" "+street,
     zipcode: post_code,
     city: city,
    state: state_id,
     
  };
  
  this.billingInfoForm.patchValue(billInfo);
  }
  
  getEstablishmentAddress(place: object) {
    this.establishmentAddress = place['formatted_address'];
    this.phone = this.getPhone(place);
    this.formattedEstablishmentAddress = place['formatted_address'];
    this.zone.run(() => {
      this.formattedEstablishmentAddress = place['formatted_address'];
      this.phone = place['formatted_phone_number'];
    });
     
  
  }
  
  getAddrComponent(place, componentTemplate) {
    let result;
  
    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }
  
  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }
  
  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }
  
  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }
  
  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }
  
  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }
  
  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }
  
  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }
  
  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }
  
  getPhone(place) {
    const COMPONENT_TEMPLATE = { formatted_phone_number: 'formatted_phone_number' },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }
  
   /********************/

}

