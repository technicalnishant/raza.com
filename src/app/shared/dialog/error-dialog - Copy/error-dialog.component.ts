import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogModel } from '../../model/error-dialog.model';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  errorModel: ErrorDialogModel;
  errorMessage:any;
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any) {
    this.errorModel = inputData.error;
      
  }

  closeIcon(): void {
    this.dialogRef.close();
  }
}
