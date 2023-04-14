import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-failed-dialog',
  templateUrl: './payment-failed-dialog.component.html',
  styleUrls: ['./payment-failed-dialog.component.scss']
})
export class PaymentFailedDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PaymentFailedDialogComponent>) { }

  ngOnInit() {
  }
  
  closeIcon(){
    this.dialogRef.close();
  }
}
