import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-number-new-dialog',
  templateUrl: './add-number-new-dialog.component.html'
})
export class AddNumberNewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddNumberNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeIcon(): void {
    this.dialogRef.close();
  }

}
