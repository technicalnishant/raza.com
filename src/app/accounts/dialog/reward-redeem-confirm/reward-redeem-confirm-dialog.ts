import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reward-redeem-confirm-dialog',
  templateUrl: './reward-redeem-confirm-dialog.html',
  styleUrls: ['./reward-redeem-confirm-dialog.scss']
})
export class RewardRedeemConfirmDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RewardRedeemConfirmDialog>,
    public dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {

  }


  onClickOk(): void{
    this.dialogRef.close(true);
  }

  closeIcon(): void {
    this.dialogRef.close(false);
  }

}
