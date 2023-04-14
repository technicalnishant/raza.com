import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-msg-dialog',
  templateUrl: './confirm-msg-dialog.component.html',
  styleUrls: ['./confirm-msg-dialog.component.css']
})
export class ConfirmMsgDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmMsgDialogComponent>,
    public dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {

  }


  closeIcon(): void {
    this.dialogRef.close();
  }

}
