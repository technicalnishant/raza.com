import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup-dialog',
  templateUrl: './confirm-popup-dialog.html',
})
export class ConfirmPopupDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupDialog>,
    public dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {

  }


  closeIcon(): void {
    this.dialogRef.close();
  }

}
