import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-what-is-cvv',
  templateUrl: './what-is-cvv.component.html',
  styleUrls: ['./what-is-cvv.component.scss']
})
export class WhatIsCvvComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<WhatIsCvvComponent>) { }

  ngOnInit(): void {
  }
  openLink(event: MouseEvent): void {
    this.dialogRef.close();
    event.preventDefault();
  }
  close()
  {
    this.dialogRef.close();
    event.preventDefault();
  }

}
