import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-cofirm',
  templateUrl: './dialog-cofirm.component.html',
  styleUrls: ['./dialog-cofirm.component.scss']
})
export class DialogCofirmComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<DialogCofirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() { }

    onClickOk(): void{
        this.dialogRef.close(true);
    }

    closeIcon(): void {
        this.dialogRef.close(false);
      }
}
