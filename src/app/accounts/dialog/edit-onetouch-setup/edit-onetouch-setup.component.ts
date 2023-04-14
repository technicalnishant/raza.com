import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { OneTouchNumber } from '../../models/onetouchNumber';

@Component({
  selector: 'app-edit-onetouch-setup',
  templateUrl: './edit-onetouch-setup.component.html',
})
export class EditOnetouchSetupComponent implements OnInit {

  editOneTouchDialForm: FormGroup
  pin: number;
  oneTouchSetup: OneTouchNumber;

  constructor(
    public dialogRef: MatDialogRef<EditOnetouchSetupComponent>,
    private _formBuilder: FormBuilder,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.pin = this.pin = this.data.pin;
    this.oneTouchSetup = this.data.oneTouchSetup;

    this.editOneTouchDialForm = this._formBuilder.group({
      hotDialNumber: [{ value: this.oneTouchSetup.HotDialNumber, disabled: true }, Validators.required],
      PhoneWithCityCode: [this.oneTouchSetup.Destination, Validators.required],
      RefNames: [this.oneTouchSetup.HotDialName, Validators.required]
    });
  }

  submitOneTouchForm() {
    if (this.editOneTouchDialForm.valid) {
      const formValues = this.editOneTouchDialForm.value;
      let body = {
        Destination: formValues.PhoneWithCityCode,
        HotDialNumber: this.oneTouchSetup.HotDialNumber,
        HotDialName: formValues.RefNames,
        RequestedBy: 'Raza Website'
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
  }

  closeIcon(): void {
    this.dialogRef.close();
  }

}
