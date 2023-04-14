import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-all-access-numbers',
  templateUrl: './all-access-numbers.dialog.html',
})
export class AllAccessNumbersDialog implements OnInit {
  accessNumbers: string[];
  constructor(
    public dialogRef: MatDialogRef<AllAccessNumbersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.accessNumbers = this.data.accessNumbers
  }

  closeIcon() {
    this.dialogRef.close();
  }
}
