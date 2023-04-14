import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cvv-bottom',
  templateUrl: './cvv-bottom.component.html',
  styleUrls: ['./cvv-bottom.component.scss']
})
export class CvvBottomComponent implements OnInit {

  constructor(private _bottomSheetRef: MatBottomSheetRef<CvvBottomComponent>) { }

  ngOnInit(): void {
  }
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
