 import { Component, OnInit, EventEmitter, Output, Input,Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
//import { isNullOrUndefined } from 'util';
import { CreditCardValidators } from 'angular-cc-library';

import { isNullOrUndefined } from "../../shared/utilities";
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CountriesService } from '../../core/services/country.service';
import { CustomerService } from '../../accounts/services/customerService';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { RazaSharedService } from '../../shared/razaShared.service';

import { CodeValuePair } from '../../core/models/codeValuePair.model';
import { Country } from '../../core/models/country.model';
import { State, PostalCode,ProcessedCard } from '../../accounts/models/billingInfo';

import { BillingInfo } from '../../accounts/models/billingInfo';
import { ViewChild, AfterViewInit  } from '@angular/core';
 import { Observable, Subscription } from 'rxjs';
 import { ICheckoutModel, NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
 import { CreditCard } from '../../accounts/models/creditCard';
 import{BottomUpComponent} from '../dialog/bottom-up/bottom-up.component';
 import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, AfterViewInit {
  /********** Google place search **********/
  @Input() selectedCard: CreditCard;
  
  @Input() billingInfo: BillingInfo;
; 
 
@Output() onPaymentSubmit = new EventEmitter<CreditCard>();
  @ViewChild('addresstext') addresstext: any;
    autocompleteInput: string;
    queryWait: boolean;
  
    address: Object;
    establishmentAddress: Object;
    formattedAddress: string;
    formattedEstablishmentAddress: string;
    phone: string;
  
    search_country:any   ='US';
    search_country_id:any=1;
  
  /**********EOF Google place search **********/
    isLinear = false;
    paymentDetailForm: FormGroup;
    billingInfoForm: FormGroup;
    months: CodeValuePair[];
    years: CodeValuePair[];
    states: State[];
    postalcodes: PostalCode[];
    processedCard:ProcessedCard[];
    fromCountry: Country[] = [];
    countryId: number;
    selectepage:number=0;
    cardSubmitted:boolean=false;
    billing_error:boolean=false;
    city_error:boolean=false;
    state_error:boolean=false;
    country_error:boolean=false;
    zip_error:boolean=false;
    card_error:boolean=false;
    exp_date:boolean=false;
    cvv_error:boolean=false;
    cardClicked:boolean=false;
    public selectedIndex: number=0;
    constructor(
      private _bottomSheet: MatBottomSheet,
      public zone: NgZone,
      
      public dialog: MatDialog,
       
      private _formBuilder: FormBuilder,
      private razaEnvService: RazaEnvironmentService,
      private customerService: CustomerService,
      private countriesService: CountriesService,
      private razaSnackBarService: RazaSnackBarService,
      private razaSharedService: RazaSharedService
    ) {
      this.razaSharedService.getTopThreeCountry().subscribe((res: any) => {
        this.fromCountry = res.slice(0, 3);
      });
  
      
  
  
      this.years = this.razaEnvService.getYears();
      this.months = this.razaEnvService.getMonths();
    }
    ngAfterViewInit(): void {
      //throw new Error('Method not implemented.');
      // this.getPlaceAutocomplete();
    }
  
    ngOnInit() {
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
  

      if (this.selectedCard) {
       
       
        this.paymentDetailForm.patchValue({
          CardNumber: this.selectedCard.CardNumber,
          //Cvv2: this.data.result.Cvv,
          ExpMonth: this.selectedCard.ExpiryMonth,
          ExpYear: this.selectedCard.ExpiryYear
        });
    
         this.billingInfoForm.patchValue({
          FullName: this.billingInfo.FirstName + " " + this.billingInfo.LastName,
          FirstName: this.billingInfo.FirstName,
          LastName: this.billingInfo.LastName,
          Country: this.billingInfo.Address.Country.CountryId,
          State: this.billingInfo.Address.State,
          BillingAddress: this.billingInfo.Address.StreetAddress,
          City: this.billingInfo.Address.City,
          PostalCode: this.billingInfo.Address.ZipCode,
        }); 
        this.loadStates(true);  
      }
       
      

      if(localStorage.getItem('selectedCvv'))
      {
        this.paymentDetailForm.patchValue({Cvv2:localStorage.getItem('selectedCvv')});
      }
      if( localStorage.getItem('errorCode'))
      {

        console.log("local error code is. "+  localStorage.getItem('errorMsg'));

        if(Number(localStorage.getItem('errorCode'))== 2 )
        {
          this.selectepage = 1;
         if(localStorage.getItem('errorMsg') == 'Please check your billing information.' )
         {
          this.billing_error = true;
          this.city_error = true;
          this.state_error = true;
          this.country_error = true;
           
         }
         if(localStorage.getItem('errorMsg') == 'ZipCode/PostalCode does not match.' )
         {
          
          this.zip_error = true;
         }
          //billingInfoForm
          //ZipCode/PostalCode does not match.
          //Please check your billing information.
        }
        if(Number(localStorage.getItem('errorCode'))== 3)
        {
           
          this.cvv_error = true;
        }
        if(Number(localStorage.getItem('errorCode'))== 4)
        {
          this.card_error =true;
          
        }
        if(Number(localStorage.getItem('errorCode'))== 5)
        {  this.exp_date=true;
          
        }
      }
  
    }

    getClass(obj:string)
    {
      var obj_class = false;
      if(obj == "billing")
      obj_class = this.billing_error;
      if(obj == "state")
      obj_class = this.state_error;
      if(obj == "city")
      obj_class = this.city_error;
      if(obj == "country")
      obj_class = this.country_error;
      if(obj == "zip")
      obj_class = this.zip_error;

      if(obj == "cvv")
      obj_class = this.cvv_error;
      if(obj == "card")
      obj_class = this.card_error;
      if(obj == "exp")
      obj_class = this.exp_date;

      
      if(obj_class == true)
      {
        return 'error_bg';
      }
      else
      return '';
    }
    removeEclass(obj:string)
    {
      var obj_class = false;
      if(obj == "billing")
      this.billing_error = false;
      if(obj == "state")
       this.state_error = false;
      if(obj == "city")
       this.city_error = false;
      if(obj == "country")
       this.country_error = false;
      if(obj == "zip")
       this.zip_error = false;

      if(obj == "cvv")
       this.cvv_error = false;

       if(obj == "card")
       this.card_error = false;
       if(obj == "exp")
       this.exp_date = false;
       

 
    }
    whatiscvv()
    {
      
      this._bottomSheet.open(BottomUpComponent);
      
    }
    get cf() { return this.paymentDetailForm.controls; }
    get af() { return this.billingInfoForm.controls; }
    validateCard()
    {
       
      this.cardSubmitted = true;
      
      if (this.paymentDetailForm.invalid) {
        return false;
      }
    }

    card_error_check()
   {
    //console.log("type char is "+this.paymentInfoForm.get('cardNumber').value);
    this.cardClicked = true;
   // var card_type = this.GetCardType(this.paymentInfoForm.get('cardNumber').value);
    //console.log(card_type);
    
   }

    get isFreeStateText() {
      return isNullOrUndefined(this.states) || this.states.length === 0;
    }
    stepChange(event){
      this.selectedIndex= event.selectedIndex;
      
  }
    loadStates(flagDefault: boolean = false): void {
      
      if (flagDefault)
        this.countryId = this.billingInfo.Address.Country.CountryId;
      else
        this.countryId = this.billingInfoForm.get('Country').value;
  
        this.search_country_id = this.countryId;
  
      if (!isNullOrUndefined(this.countryId))
        this.countriesService.getStates(this.countryId).subscribe(
          (res: State[]) => {
            this.states = res;
          }
        )
    }
  
    loadPostalCode(): void {
      let stateId = this.billingInfoForm.get('State').value;
      if (!isNullOrUndefined(stateId))
        this.countriesService.getPostalCodes(stateId).subscribe(
          (res: PostalCode[]) => { this.postalcodes = res; }
        )
    }
  
    paymentDetailFormSubmit(): void {
  
      if (!this.billingInfoForm.valid)
        return;
        let creditCard: CreditCard = {
          CardId: 0,
          CardNumber: (this.paymentDetailForm.get('CardNumber').value as string).replace(/\s/g, ''),
          CardType: '',
          //ExpiryDate: null,
          //ExpiryDate: formValues.validFrom+"/"+formValues.validTo,
          ExpiryDate: this.paymentDetailForm.get('ExpMonth').value+this.paymentDetailForm.get('ExpYear').value,
          ExpiryMonth: this.paymentDetailForm.get('ExpMonth').value,
          ExpiryYear: this.paymentDetailForm.get('ExpYear').value,
          Cvv: this.paymentDetailForm.get('Cvv2').value,
          Status: true,
          CardHolderName: `${this.billingInfo.FirstName} ${this.billingInfo.LastName}`,
          IsPrimary: true,
          FullName: this.billingInfoForm.get('FullName').value,
          Country: this.billingInfo.Address.Country.CountryId.toString(),
          State: this.billingInfoForm.get('State').value,
          BillingAddress: this.billingInfoForm.get('BillingAddress').value,
          City: this.billingInfoForm.get('City').value,
          PostalCode: this.billingInfoForm.get('PostalCode').value,
          PhoneNumber: ''
        }
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
             this.razaSnackBarService.openSuccess("Information updated successfully.");
           //  this.onPaymentSubmit.emit(creditCard); 
            this.customerService.getSavedCreditCards().toPromise().then((cr: CreditCard[]) => {
              creditCard.CardId = cr[0].CardId;
              this.onPaymentSubmit.emit(creditCard);
            })
          }
          else
            this.razaSnackBarService.openError("Unable to save information, Please try again.");
        },
        err => this.razaSnackBarService.openError("An error occurred!! Please try again.")
      )
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
  
    var street = this.getStreet(place); 
    var street_no =this.getStreetNumber(place); 
    var post_code = this.getPostCode(place)
    var city = this.getCity(place);
    var state = this.getState(place);
    
    if(street_no !== 'undefined')
      {
  
      }
      else{
        street_no = '';
      }
   
  var state_id = '';
  
  if(this.states && this.states[0])
  {
    for(var i=0; i< this.states.length; i++)
    {
      if(this.states[i].Id == state)
      {
        state_id = this.states[i].Id;
      }
       
    }
  
  }
  if(this.search_country_id == 3)
  {
    state_id='3';
  }
    this.billingInfoForm.patchValue({ 
     // Country: this.data.result2.Address.Country.CountryId,
      State: state_id,
      BillingAddress: street_no+" "+street,
      City: city,
      PostalCode: post_code,
      
    });
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
  
