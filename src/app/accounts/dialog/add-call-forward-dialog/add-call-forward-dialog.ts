import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CountriesService } from '../../../core/services/country.service';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { PlanService } from '../../services/planService';
import { throwError } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { Plan } from '../../models/plan';
import { RazaSharedService } from '../../../shared/razaShared.service';
import { DatePipe } from '@angular/common';


import { Observable } from 'rxjs/internal/Observable';
 
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-call-forward-dialog',
  templateUrl: './add-call-forward-dialog.html',
})
export class AddCallForwardDialog implements OnInit {

  callForwardSetupForm: FormGroup;
  available800Numbers: string[];
  countries: Country[];
  plan: Plan;
  pin: number;
  filteredCountry: Observable<any[]>;
  allCountry:any[];
  autoControl=new FormControl();
  showDropdown : boolean = false;
  showPlaceholder : boolean = true;
   
  searchicon:any;

  constructor(
    public dialogRef: MatDialogRef<AddCallForwardDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private countriesService: CountriesService,
    private countryService: CountriesService,
    private planService: PlanService,
    private datePipe: DatePipe,
    private razaSnackBarService: RazaSnackBarService
  ) {
    this.pin = data.plan;
  }

  ngOnInit() {
    this.callForwardSetupForm = new FormGroup({
      FollowMeNumber: new FormControl('', Validators.required),
      DisplayName: new FormControl(''),
      Country: new FormControl('', Validators.required),
      CountryCode: new FormControl({ value: '', disabled: true }, Validators.required),
      PhoneNumber: new FormControl('', Validators.required),
      ActivationDate: new FormControl({ value: '', disabled: true }, Validators.required),
      ExpiryDate: new FormControl({ value: '', disabled: true }, Validators.required),
    })

    this.loadAvailable800Numbers();
    this.loadCountries();

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
  onSelectCountryChange(): void {
    let selCountry = this.callForwardSetupForm.get('Country').value;
    this.callForwardSetupForm.get('CountryCode').setValue(selCountry.CountryCode);

  }

  //Load Countries
  loadCountries(): void {
    this.countryService.getAllCountries().subscribe(
      (res: Country[]) => {
        this.countries = res;
        this.allCountry = res;
      },
      err => console.log(err)
    )
  }

  //Load Available 800 Numbers.
  loadAvailable800Numbers(): void {
    this.planService.getAvailable800Numbers().subscribe(
      (res: string[]) => this.available800Numbers = res,
      err => console.log(err)
    )

  }

  onSubmitCallForwardSetupForm(): void {
    let formData = this.callForwardSetupForm.value;

    let body = {
      FollowMeNumber: formData.FollowMeNumber,
      DisplayName: formData.DisplayName,
      CountryCode: this.callForwardSetupForm.get('CountryCode').value,
      PhoneNumber: formData.PhoneNumber,
      // ActivationDate : this.callForwardSetupForm.get('ActivationDate').value.toDateString(),
      // ExpiryDate: this.callForwardSetupForm.get('ExpiryDate').value.toDateString(),
      ActivationDate: this.datePipe.transform(this.callForwardSetupForm.get('ActivationDate').value, 'yyyy-MM-dd'),
      ExpiryDate: this.datePipe.transform(this.callForwardSetupForm.get('ExpiryDate').value, 'yyyy-MM-dd'),
      RequestedBy: 'website'
    }

    this.planService.SaveCallForwardSetup(this.pin, body).subscribe(
      res => {
        this.razaSnackBarService.openSuccess('Call Forward setup successfully.')
        this.dialogRef.close("success");

      },
      (err: any) => {
        console.log(err);
        this.razaSnackBarService.openError(err.error.Message)
      }
    );
  }

  closeIcon(): void {
    this.dialogRef.close();
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
     this.callForwardSetupForm.controls['Country'].setValue(obj);
     this.onSelectCountryChange();
    
  }
  onClickPlaceholder() {
    this.showPlaceholder = false;
    document.getElementById("searchInput").focus();
  }
}
