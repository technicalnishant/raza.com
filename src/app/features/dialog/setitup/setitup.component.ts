import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-setitup',
  templateUrl: './setitup.component.html',
  styleUrls: ['./setitup.component.scss']
})
export class SetitupComponent {
  constructor(
    public dialogRef: MatDialogRef<SetitupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeIcon(): void {
    this.dialogRef.close();
  }

  submitSetItUp(cardNumber,pwd,dob){

  }
}

