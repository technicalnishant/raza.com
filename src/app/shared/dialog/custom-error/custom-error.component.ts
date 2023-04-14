import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogModel } from '../../model/error-dialog.model';
@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html',
  styleUrls: ['./custom-error.component.scss']
})
export class CustomErrorComponent {

  errorModel: ErrorDialogModel;
  errorMessage:any;
  constructor(
    public dialogRef: MatDialogRef<CustomErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any) {
    this.errorModel = inputData.error;
	this.errorMessage = inputData.errorMsg;
     
     
  }

  closeIcon(): void {
    this.dialogRef.close();
  }
}
