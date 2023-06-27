import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
//import { isNullOrUndefined } from 'util';
import { CreditCardValidators } from 'angular-cc-library';

import { isNullOrUndefined } from "../../../shared/utilities";
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CountriesService } from '../../../core/services/country.service';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { RazaSharedService } from '../../../shared/razaShared.service';

import { CodeValuePair } from '../../../core/models/codeValuePair.model';
import { Country } from '../../../core/models/country.model';
import { State, PostalCode,ProcessedCard } from '../../models/billingInfo';


import { ViewChild, EventEmitter, Output, AfterViewInit, Input } from '@angular/core';
 import { Observable, Subscription } from 'rxjs';
 import { MatBottomSheet } from '@angular/material/bottom-sheet';
 import { CvvBottomComponent } from 'app/cvv-bottom/cvv-bottom.component';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
@Component({
  selector: 'app-add-edit-card',
  templateUrl: './add-edit-card.component.html',
  styleUrls: ['./add-edit-card.component.scss']
})
export class AddEditCardComponent implements OnInit, AfterViewInit {
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
    isLoading:boolean=false;
    public selectedIndex: number=0;
    constructor(
      private _bottomSheet: MatBottomSheet,
      public zone: NgZone,
      public dialogRef: MatDialogRef<AddEditCardComponent>,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
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
  
      this.loadStates(true);
  
  
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
  
      if (!isNullOrUndefined(this.data.result)) {
        this.paymentDetailForm.patchValue({
          CardNumber: this.data.result.CardNumber,
          ExpMonth: this.data.result.ExpiryMonth,
          ExpYear: this.data.result.ExpiryYear
        });
         
        if(localStorage.getItem('selectedCvv'))
        {
          this.paymentDetailForm.patchValue({Cvv2:localStorage.getItem('selectedCvv')});
        }
       
      }
   
  
     if (!isNullOrUndefined(this.data.cardFull) && this.data.cardFull.CreditCardAddress) {
      let address = this.data.cardFull.CreditCardAddress;
        this.billingInfoForm.patchValue({
          FullName: this.data.cardFull.CardHolderName,
          Country: address.Country.CountryId,
          State: address.State,
          BillingAddress: address.StreetAddress,
          City: address.City,
          PostalCode: address.ZipCode,
        });
        this.search_country_id = address.Country.CountryId;
        
      }
       
    }
  
    get isFreeStateText() {
      return isNullOrUndefined(this.states) || this.states.length === 0;
    }
    stepChange(event){
      this.selectedIndex= event.selectedIndex;
      
  }
    loadStates(flagDefault: boolean = false): void {
      
      if (flagDefault)
        this.countryId = this.search_country_id;
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
      this.isLoading = true;
      let data='success'+','+body.Cvv2;
      this.customerService.SaveCreditCard(body).subscribe(
  
        (res: boolean) => {
          if (res) {
            this.dialogRef.close(data);
          }
          else
          {
            this.isLoading = false;
            this.razaSnackBarService.openError("Unable to save information, Please try again.");
          }
            
        },
        err => {
          this.isLoading = false;
          
          this.razaSnackBarService.openError(err.error)
        
      }
      )
    }
  
    closeIcon(): void {
      this.dialogRef.close();
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
  
  if(this.states[0])
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
  onCheckCard(event: any){
    var card = event.target.value;
      console.log(event.target.value);
      var discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
      ////6011, 622126-622925, 644-649, 65
  
  
      // get rid of anything but numbers
      card = card.replace(/\D/g, '');
      if (card.match(discover_regex)) {
        
        this.paymentDetailForm.controls['CardNumber'].setValue('');
        this.razaSnackBarService.openError("OOPS! Sorry,  we do not accept Discover cards. Please use Visa or Master card to process your transaction.");
      }
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
    
    goBack()
    {
  
    }
   /********************/
  }
  