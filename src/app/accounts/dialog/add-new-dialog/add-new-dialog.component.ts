import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from '../../../shared/model/country';
import { PostalCode, State } from '../../models/billingInfo';
import { RazaSharedService } from '../../../shared/razaShared.service';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { CountriesService } from '../../../core/services/country.service';
//import { isNullOrUndefined } from 'util';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { isNullOrUndefined } from "../../../shared/utilities";

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html'
})
export class AddNewDialogComponent implements OnInit {
  fromCountry: Country[] = [];
  toCountry: Country[] = [];
  states: State[];
  postalcodes: PostalCode[];
  numbers: string[];
  oneTouchDialForm: FormGroup;
  oneTouchDialToForm: FormGroup;
  pin: string;
  constructor(
    public dialogRef: MatDialogRef<AddNewDialogComponent>,
    private razaSharedService: RazaSharedService,
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    private countriesService: CountriesService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.razaSharedService.getTopThreeCountry().subscribe((res: any) => {
      this.fromCountry = res.slice(0, 3);
      this.toCountry = res;
      this.pin = data;
    });

    this.oneTouchDialForm = this._formBuilder.group({
      Country: ['', Validators.required],
      State: ['', Validators.required],
      PostalCode: ['', Validators.required],
      AvailableNumbers: ['', Validators.required]
    });

    this.oneTouchDialToForm = this._formBuilder.group({
      CountryTo: ['', Validators.required],
      PhoneWithCityCode: ['', Validators.required],
      Code: ['', Validators.required],
      RefNames: ['', Validators.required]
    });
  }

  ngOnInit() { }

  loadStates(): void {
    let countryId = this.oneTouchDialForm.get('Country').value;
    if (!isNullOrUndefined(countryId))
      this.countriesService.getStates(countryId).subscribe(
        (res: State[]) => this.states = res,
        (err: ApiErrorResponse) => console.log(err),
      )
  }

  loadPostalCode(): void {
    let stateId = this.oneTouchDialForm.get('State').value;
    if (!isNullOrUndefined(stateId))
      this.countriesService.getPostalCodes(stateId).subscribe(
        (res: PostalCode[]) => { this.postalcodes = res; }
      )
  }

  loadNumbers(): void {
    let countryId = this.oneTouchDialForm.get('Country').value;
    let stateId = this.oneTouchDialForm.get('State').value;
    let areaCode = this.oneTouchDialForm.get('PostalCode').value;

    if (!isNullOrUndefined(stateId))
      this.customerService.getNumbers(this.pin, countryId, stateId, areaCode).subscribe(
        (res: string[]) => { this.numbers = res;
          // console.log('res', res) 
          }
      )
  }

  oneTouchFormSubmit(): void {

    if (!this.oneTouchDialToForm.valid)
      return;

    let body = {
      Destination: this.oneTouchDialToForm.get('CountryTo').value,
      HotDialNumber: this.oneTouchDialToForm.get('PhoneWithCityCode').value,
      HotDialName: this.oneTouchDialToForm.get('RefNames').value,
      RequestedBy: 'test'
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
}