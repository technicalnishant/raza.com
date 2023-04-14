import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CodeValuePair } from '../../../core/models/codeValuePair.model';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CvvBottomComponent } from 'app/cvv-bottom/cvv-bottom.component';
@Component({
  selector: 'app-add-billingadd-dialog',
  templateUrl: './add-billingadd-dialog.html',
})
export class AddBillingaddDialog implements OnInit {
  isLinear = false;
  paymentDetailForm: FormGroup;
  billingInfoForm: FormGroup;
  months: CodeValuePair[];
  years: CodeValuePair[];

  constructor(
    private _bottomSheet: MatBottomSheet,
    public dialogRef: MatDialogRef<AddBillingaddDialog>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private razaEnvService: RazaEnvironmentService,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService
  ) { }

  ngOnInit() {
    this.paymentDetailForm = this._formBuilder.group({
      CardNumber: ['', Validators.required],
      Cvv2: ['', Validators.required],
      ExpMonth: ['', Validators.required],
      ExpYear: ['', Validators.required],
      NameOnCard: ['ABC', null],
      Country: ['10', null],
      BillingAddress: ['Testing', null],
      City: ['XYZ', null],
      State: ['PQR', null],
      ZipCode: ['11900', null]
    });

    this.years = this.razaEnvService.getYears();
    this.months = this.razaEnvService.getMonths();

  }

  paymentDetailFormSubmit(): void {

    if (!this.paymentDetailForm.valid)
      return;
    let body: any = this.paymentDetailForm.value;

    this.customerService.SaveCreditCard(body).subscribe(
      (res: boolean) => {
        if (res) {
          this.razaSnackBarService.openSuccess("Credit card saved successfully.");
          this.dialogRef.close();
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

  nextBillingAddress() { }

  whatiscvv()
  {
   this._bottomSheet.open(CvvBottomComponent);
  /* const dialogRef = this.dialog.open(BottomUpComponent, {
     data: {
       success: 'success'
     }
   });*/
    
  }

}
