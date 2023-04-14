import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BillingInfo, State } from '../../models/billingInfo';
import { Country } from '../../../core/models/country.model';
import { CustomerService } from '../../services/customerService';
import { CountriesService } from '../../../core/services/country.service';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { AuthenticationService } from '../../../core/services/auth.service';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";

@Component({
  selector: 'app-edit-billing-info-dialog',
  templateUrl: './edit-billing-info-dialog.html',
})
export class EditBillingInfoDialog implements OnInit {
  billingInfoForm: FormGroup;
  billingInfo: BillingInfo;
  countries: Country[];
  states: State[];
  isDisplayChangePassword: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<EditBillingInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    private countriesService: CountriesService,
    private razaSnackBarService: RazaSnackBarService,
    private authService: AuthenticationService
  ) {
    this.countriesService.getFromCountries().subscribe(
      (data: Country[]) => this.countries = data
    )

  }

  ngOnInit() {

    this.billingInfoForm = new FormGroup({
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      StreetAddress: new FormControl('', Validators.required),
      City: new FormControl('', Validators.required),
      State: new FormControl('', Validators.required),
      CountryId: new FormControl(1, Validators.required),
      ZipCode: new FormControl('', Validators.required),
      PhoneNUmber: new FormControl('', Validators.required),
      ReferrerEmailId: new FormControl(''),
      // password: new FormControl(''),
      // confirmPassword: new FormControl(''),
    });

    this.customerService.getCustomerBillingInfo().subscribe(
      (data: BillingInfo) => {
        this.billingInfo = data
        let bilInfo = {
          FirstName: data.FirstName,
          LastName: data.LastName,
          StreetAddress: data.Address.StreetAddress,
          City: data.Address.City,
          State: data.Address.State,
          CountryId: data.Address.Country.CountryId,
          ZipCode: data.Address.ZipCode,
          PhoneNUmber: data.Address.HomePhone
        }
        this.billingInfoForm.patchValue(bilInfo);
        this.loadStates();
      }
    )
  }

  loadStates(): void {
    let countryId = this.billingInfoForm.get('CountryId').value;

    // if (countryId === 3) {
    //   this.billingInfoForm.get('State').setValidators(null);
    // } else {
    //   this.billingInfoForm.get('State').setValidators(Validators.required);
    // }

    this.countriesService.getStates(countryId).subscribe(
      (res: State[]) => this.states = res
    )
  }


  get isFreeStateText() {
    return isNullOrUndefined(this.states) || this.states.length === 0;
  }

  onSubmitBillingInfoForm(): void {

    if (!this.billingInfoForm.valid) {
      return;
    }
    let model = this.billingInfoForm.value;
    this.customerService.SaveCustomerBillingInfo(model).subscribe(
      (res: boolean) => {
        this.dialogRef.close();
        this.razaSnackBarService.openSuccess("Profile successfully updated.");
        //if (this.isDisplayChangePassword) {
         // this.updatePassword(this.billingInfoForm.get('password').value).subscribe();
        //}
      },
      err => {
        this.razaSnackBarService.openError("Internel server error !! Please try again.")
      }
    )
  }

  // changePassword() {
  //   this.isDisplayChangePassword = !this.isDisplayChangePassword;
  //   if (this.isDisplayChangePassword) {

  //     this.billingInfoForm.get('password').setValidators(Validators.required);
  //     this.billingInfoForm.get('confirmPassword').setValidators(Validators.required);
  //     this.billingInfoForm.setValidators(ConfirmPasswordValidator.MatchPassword)
  //   } else {
  //     this.billingInfoForm.clearValidators();
  //     this.billingInfoForm.get('password').clearValidators();
  //     this.billingInfoForm.get('confirmPassword').clearValidators();
  //     this.billingInfoForm.get('password').updateValueAndValidity();
  //     this.billingInfoForm.get('confirmPassword').updateValueAndValidity();
  //     this.billingInfoForm.updateValueAndValidity();
  //   }
  // }

  // updatePassword(newPassword: string): Observable<boolean> {
  //   return this.authService.updatePassword(newPassword);
  // }

  closeIcon(): void {
    this.dialogRef.close();
  }

}
