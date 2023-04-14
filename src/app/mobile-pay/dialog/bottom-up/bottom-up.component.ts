import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
@Component({
  selector: 'app-bottom-up',
  templateUrl: './bottom-up.component.html',
  styleUrls: ['./bottom-up.component.scss']
})
export class BottomUpComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomUpComponent>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
  close()
  {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}