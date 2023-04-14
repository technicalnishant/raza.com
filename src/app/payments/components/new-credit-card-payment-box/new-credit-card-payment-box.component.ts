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

@Component({
  selector: 'new-credit-card-payment-box',
  templateUrl: './new-credit-card-payment-box.component.html',
  styleUrls: ['./new-credit-card-payment-box.component.scss']
})
export class NewCreditCardPaymentBoxComponent implements OnInit, AfterViewInit {
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
  @Input() checkOutModel: ICheckoutModel;
  @Output() onPaymentSubmit = new EventEmitter<CreditCard>();
  paymentSubmitted: boolean;

  
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
  ) { }
  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
    //this.getPlaceAutocomplete();
  }
   
  ngOnInit() {

    this.paymentInfoForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, CreditCardValidators.validateCCNumber]],
      validFrom: ['', [Validators.required]],
      validTo: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      firstName: ['', [Validators.required]],
       
      lastName: ['', [Validators.required]], 
      //email: ['',[Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      email: [''],
      address: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: [this.countryFromId, [Validators.required]],
      isAutRefill: [{ value: this.checkOutModel.isAutoRefill}],
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


    if (this.checkOutModel.transactiontype === TransactionType.Sale || this.checkOutModel.transactiontype === TransactionType.Activation) {
      
      this.paymentInfoForm.controls['isAutRefill'].setValue(true);
    }


    this.getCountryFrom();
    this.onCountryChange(this.countryFromId);
    this.getCustomerCards();
    this._initAutoRefillTooltip();
    this.paymentProcessor = 'Cardinal'
    //this.checkPaymentProcess();
    //this.getBraintreeToken();
    this.removeLocalStorage();
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

  onClickCreditCardBraintree(){
    this.paymentSubmitted = true;
    if (this.selectedCard === null)
      return;
    if (this.selectedCard.Cvv.length < 3)
      return;

    this.selectedCard.CardHolderName = `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`;
    this.selectedCard.FullName = this.selectedCard.CardHolderName;
    this.selectedCard.PhoneNumber = this.billingInfo.Address.HomePhone;
     
    /*
    this.braintreeCard.Address = this.billingInfo.Address.StreetAddress;
    this.braintreeCard.Amount = 0;
    this.braintreeCard.CardNumber = this.selectedCard.CardNumber;
    this.braintreeCard.CvvValue = this.selectedCard.Cvv;
    this.braintreeCard.ExpiryDate = this.selectedCard.ExpiryMonth+'/'+this.selectedCard.ExpiryYear;
    

    
    this.braintreeCard.Comment1 = 'N/A';
    this.braintreeCard.Comment2 = 'N/A';
    
    this.braintreeCard.CurrencyCode = 'USD';
    
    this.braintreeCard.DoAuthorize = true;
    this.braintreeCard.EmailAddress = this.billingInfo.Email;
    this.braintreeCard.FirstName = this.billingInfo.FirstName;
    this.braintreeCard.HomePhone = this.billingInfo.Address.HomePhone;
    this.braintreeCard.IpAddress = '111.111.111.111';
    this.braintreeCard.LastName = this.billingInfo.LastName;
    this.braintreeCard.OrderId = '';
    this.braintreeCard.Country = 1;
    this.braintreeCard.City = this.billingInfo.Address.City;
    this.braintreeCard.State = this.billingInfo.Address.State;
    this.braintreeCard.ZipCode = this.billingInfo.Address.ZipCode;
*/
   // this.onPaymentSubmit.emit(this.selectedCard.ExpiryMonth);


   var data_param = {
  
    "Address1": this.billingInfo.Address.StreetAddress,
    "Amount": "0",
    "CardNumber": this.selectedCard.CardNumber,
    "City": this.billingInfo.Address.City,
    "Comment1": "",
    "Comment2": "",
    "Country": "1",
    "CurrencyCode": "USD",
    "CvvValue": this.selectedCard.Cvv,
    "DoAuthorize": "true",
    "EmailAddress": this.billingInfo.Email,
    "ExpiryDate": this.selectedCard.ExpiryMonth+'/'+this.selectedCard.ExpiryYear,
    "FirstName": this.billingInfo.FirstName,
    "HomePhone": this.billingInfo.Address.HomePhone,
    "IpAddress": "111.111.111.111",
    "LastName": this.billingInfo.LastName,
    "OrderId": "",
    "State": this.billingInfo.Address.State,
    "ZipCode": this.billingInfo.Address.ZipCode

};

   this.httpClient.post<any>('https://restapi.razacomm.com/api/BrainTree/808319',data_param).subscribe(data => {
	// this.postId = data.id;
	   this.varifyCard(data);
	  
  });
  
  }
  varifyCard(data)
  {
    var threeDSecure;
    braintree.client.create({
      // Use the generated client token to instantiate the Braintree client.
      authorization: this.braintreeToken.token
    }).then(function (clientInstance) {
      return braintree.threeDSecure.create({
      //  'version': '2', 
      'client': clientInstance
      });
    }).then(function (threeDSecureInstance) {
      threeDSecure = threeDSecureInstance;
      
      var my3DSContainer;
      threeDSecure.verifyCard({
       nonce: data.Nonce,
       amount: 123.45,
       addFrame: function (err, iframe) {
         // Set up your UI and add the iframe.
          my3DSContainer = document.createElement('div');
         //my3DSContainer = document.getElementById('el');
         my3DSContainer.appendChild(iframe);
         document.body.appendChild(my3DSContainer);
         
         
       },
       removeFrame: function () {
         // Remove UI that you added in addFrame.
        document.body.removeChild(my3DSContainer);
         
      }
      }, function (err, payload) {
       if (err) {
         console.error(err);
       return;
       }
      
       console.log("Paymentnonce");
         console.log(payload);

       if (payload.liabilityShifted) {
         // Liablity has shifted
         //console.log("Paymentnonce");
        // console.log(payload);
         //submitNonceToServer(payload.nonce);
      } else if (payload.liabilityShiftPossible) {
         // Liablity may still be shifted
         // Decide if you want to submit the nonce
      } else {
         // Liablity has not shifted and will not shift
        // Decide if you want to submit the nonce
       }
      });
    
    
       
      
    }).catch(function (err) {
      // Handle component creation error
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
        FullName: `${formValues.firstName} ${formValues.lastName}`,
        Country: this.billingInfo.Address.Country.CountryId.toString(),
        State: formValues.state,
        BillingAddress: formValues.address,
        City: formValues.city,
        PostalCode: formValues.zipcode,
        PhoneNumber: formValues.phoneNumber
      }

      if (this.checkOutModel.transactiontype === TransactionType.Recharge) {
        this.saveAndGetCard(creditCard).toPromise()
          .then(res => {
            this.customerService.getSavedCreditCards().toPromise().then((cr: CreditCard[]) => {
              creditCard.CardId = cr[0].CardId;
              this.onPaymentSubmit.emit(creditCard);
            })
          },(err: ApiErrorResponse) => { this.razaSnackbarService.openError(err.error) })
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
        this.paymentInfoForm.patchValue(billInfo);
      })
  }

  private updateBillingInfo(): Observable<boolean | ApiErrorResponse> {
    const formValues = this.paymentInfoForm.value;

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
      
      this.cardBillingAddress(data, card);
    });
  }

  cardBillingAddress(data, card:any) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: data,
        cardFull:card,
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
        
            this.cardBillingAddress(data, []);
          });
        },
      (err: ApiErrorResponse) => console.log(err),
    )
     this.loadBillingInfo();
  }
   /********************/
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
  
  this.paymentInfoForm.patchValue(billInfo);
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
