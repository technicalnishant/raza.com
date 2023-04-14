import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plan } from '../../models/plan';
import { PlanService } from '../../services/planService';
import { pinlessNumber } from '../../models/pinlessNumber';
import { Country } from '../../../core/models/country.model';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { RazaSharedService } from '../../../shared/razaShared.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';

@Component({
    selector: 'addPinlessSetupDialog',
    templateUrl: 'add-pinless-setup-dialog.html'
})

export class AddPinlessSetupDialog implements OnInit {
    addPinlessSetupForm: FormGroup;
    plan: Plan;
    pin: any;
    country: any;
    fromCountries: Country[];
    pinlessNumbers: pinlessNumber[];
    constructor(
        public dialogRef: MatDialogRef<AddPinlessSetupDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private razaSharedService: RazaSharedService,
        private planService: PlanService,
        private razaSnackBarService: RazaSnackBarService
    ) { }

    closeIcon(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.plan = this.data.plan;
        this.pin = this.data.plan;
        this.country=this.data.countryId;
        this.razaSharedService.getTopThreeCountry().subscribe(
            (res: Country[]) => {this.fromCountries = res.slice(0, 3);},
            err => console.log(err)
        );



        this.planService.getPinlessNumbers(this.pin).subscribe(
            (data: pinlessNumber[]) => { this.pinlessNumbers = data; },
            (err: ApiErrorResponse) => console.log(err),
        );

        this.addPinlessSetupForm = this.formBuilder.group({
            Country: ['', [Validators.required]],
            PinlessNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]]
        });

        this.patchDataValue(this.country);
    }

    patchDataValue(data){
        this.addPinlessSetupForm.patchValue({Country: data});
    }

    onPinlessSetupFormSubmit(): void {
        if (!this.addPinlessSetupForm.valid)
            return;
        let filtered = this.pinlessNumbers.filter(r => r.PinlessNumber == this.addPinlessSetupForm.get('PinlessNumber').value);
        let countrymatch=this.fromCountries.filter(a=> a.CountryId==this.addPinlessSetupForm.get('Country').value);
        
        let body: pinlessNumber = new pinlessNumber();
        console.log('countrymatch',countrymatch);
        // body.CountryCode = this.addPinlessSetupForm.get('Country').value.CountryCode;
        body.CountryCode = countrymatch[0].CountryCode;
        body.PinlessNumber = this.addPinlessSetupForm.get('PinlessNumber').value;
        body.RequestedBy = 'test';

        if (filtered.length > 0) {
            this.razaSnackBarService.openSuccess("This number is already registered under your plan.");
        }
        else {
            if (this.pinlessNumbers.length >= 5) {
                this.razaSnackBarService.openError("A Maximum limit of 5 pinless numbers reached.");
            }
            else {
                this.planService.AddPinlessSetup(this.pin, body).subscribe(
                    res => {
                        this.dialogRef.close('success');
                        this.razaSnackBarService.openSuccess("Pinless number Added Successfully.");
                    },
                    (err: ApiErrorResponse) => {
                        console.log(err);
                        this.razaSnackBarService.openError(err.error.Message);
                    }
                )
            }
        }
    }
}