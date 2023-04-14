import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
@Component({
  selector: 'app-topup-dialog',
  templateUrl: './topup-dialog.component.html',
  styleUrls: ['./topup-dialog.component.scss']
})
export class TopupDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit(): void {
  }
 

close() {
    this.dialogRef.close();
}

}
