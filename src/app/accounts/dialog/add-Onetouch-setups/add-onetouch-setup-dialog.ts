import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RazaSharedService } from '../../../shared/razaShared.service';
import { Country } from '../../../shared/model/country';
import { State, PostalCode } from '../../models/billingInfo';
//import { isNullOrUndefined } from 'util';
import { CountriesService } from '../../../core/services/country.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { OneTouchNumber } from '../../models/onetouchNumber';
import { isNullOrUndefined } from "../../../shared/utilities";

 
import { Observable } from 'rxjs/internal/Observable';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { BillingInfo } from '../../models/billingInfo';
@Component({
  selector: 'AddOnetouchSetupDialog',
  templateUrl: 'add-onetouch-setup-dialog.html'
})

export class AddOnetouchSetupDialog implements OnInit {
  fromCountry: Country[] = [];
  toCountry: Country[] = [];
  states: State[];
  postalcodes: PostalCode[];
  numbers: string[];
  oneTouchDialForm: FormGroup;
  oneTouchDialToForm: FormGroup;
  filteredStates: Observable<any[]>;
  filteredCountry: Observable<any[]>;
  autoControl=new FormControl();
  State = new FormControl();
  allStates: any[];
  allCountry:any[];
  
  showDropdown : boolean = false;
  showPlaceholder : boolean = true;
  pin: string;
  searchicon:any;
  
  billingInfo: BillingInfo;
  constructor(
    public dialogRef: MatDialogRef<AddOnetouchSetupDialog>,
    private razaSharedService: RazaSharedService,
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    private countriesService: CountriesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.pin = data.pin;


  }

  ngOnInit() {
    
    const setup: OneTouchNumber = this.data.oneTouchSeup;
    this.createFormGroups();
    this.loadCountries();
    
    
    if (!isNullOrUndefined(setup)) {
      this.patchCurrentSetupValues(setup)
    }

    this.filteredCountry = this.autoControl.valueChanges
    .pipe(
      startWith<string | any>(''),
      map(value => typeof value === 'string' ? value : value.CountryName),
      map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
    );
    
  }

  
  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  displayFn(country?: any): string | undefined {
    return country ? country.CountryName : undefined;
  }

  onClickInput() {  }
  onInputFocus() {
    this.searchicon = 'https://d2uij5nbaiduhc.cloudfront.net/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }
  setState(obj)
  {
     this.oneTouchDialToForm.controls['CountryTo'].setValue(obj);
    
  }

  loadCountries() {
    this.razaSharedService.getTopThreeCountry().subscribe((res: any) => {
      this.fromCountry = res.slice(0, 3);
      this.loadBillingInfo();
    });

    this.countriesService.getAllCountries().subscribe((res: Country[]) => {
      this.toCountry = res;
      this.allCountry = res;
      //console.log(this.allCountry);
    })
  }

  createFormGroups() {
    this.oneTouchDialForm = this._formBuilder.group({
      Country: ['', Validators.required],
      State: ['', Validators.required],
      PostalCode: ['', Validators.required],
      AvailableNumbers: ['', Validators.required]
    });

    this.oneTouchDialToForm = this._formBuilder.group({
      CountryTo: ['', Validators.required],
      PhoneWithCityCode: ['', Validators.required],
      RefNames: ['', Validators.required]
    });
  }
  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
        if(this.billingInfo.Address.Country)
        {
          console.log(this.billingInfo.Address.Country);
          
          
          this.oneTouchDialForm.patchValue({Country:this.billingInfo.Address.Country.CountryId});
          this.loadStates();
          //this.oneTouchDialToForm.controls['State'].setValue(this.billingInfo.Address.State);
          
        }
        
      })
  }
  patchCurrentSetupValues(setup: OneTouchNumber) {
    const oneTouchDialFormValue = {
      Country: 1,
      State: '',
      PostalCode: '',
      AvailableNumbers: ''
    }

    const oneTouchDialToFormVal = {
      CountryTo: 1,
      PhoneWithCityCode: '',
      Code: '',
      RefNames: ''
    }

    this.oneTouchDialForm.patchValue(oneTouchDialFormValue);
    this.oneTouchDialToForm.patchValue(oneTouchDialToFormVal);

  }

  loadStates(): void {
     
    
    //this.oneTouchDialForm.controls['stateText'].setValue('');
    let countryId = this.oneTouchDialForm.get('Country').value;
    if (!isNullOrUndefined(countryId))
      this.countriesService.getStates(countryId).subscribe(
        (res: State[]) => {
          this.states = res;
        this.oneTouchDialForm.patchValue({State:this.billingInfo.Address.State});
          this.loadPostalCode();
        
        }
      )
  }

  loadPostalCode(): void {
    let stateId = this.oneTouchDialForm.get('State').value;
    if (!isNullOrUndefined(stateId))
      this.countriesService.getPostalCodes(stateId).subscribe(
        (res: PostalCode[]) => { this.postalcodes = res; 
        
        }
      
      )
  }

  loadNumbers(): void {
    let countryId = this.oneTouchDialForm.get('Country').value;
    let stateId = this.oneTouchDialForm.get('State').value;
    let areaCode = this.oneTouchDialForm.get('PostalCode').value;

    if (!isNullOrUndefined(stateId))
      this.customerService.getNumbers(this.pin, countryId, stateId, areaCode).subscribe(
        (res: string[]) => {
        this.numbers = res;
          // console.log('no', res); 
        }
      )
  }

  oneTouchFormSubmit(): void {

    if (!this.oneTouchDialToForm.valid)
      return;

    let body = {
      Destination: `011${this.oneTouchDialToForm.get('CountryTo').value.CountryCode}${this.oneTouchDialToForm.get('PhoneWithCityCode').value}`,
      HotDialNumber: this.oneTouchDialForm.get('AvailableNumbers').value,
      HotDialName: this.oneTouchDialToForm.get('RefNames').value,
      RequestedBy: 'Raza Web'
    }
    this.customerService.postOneTouchSetUp(this.pin, body).subscribe(
      (res: boolean) => {
        if (res) {
          this.razaSnackBarService.openSuccess("One Touch SetUp saved successfully.");
          this.dialogRef.close('success');
        }
        else
          this.razaSnackBarService.openError("Unable to save information, Please try again.");
      },
      err => this.razaSnackBarService.openError("An error occurred!! Please try again.")
    )
  }

  closeIcon(): void {
    this.dialogRef.close();
  }

  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }
}