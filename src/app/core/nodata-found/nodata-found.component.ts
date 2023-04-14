import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { AppBaseComponent } from '../../shared/components/app-base-component';
@Component({
  selector: 'app-nodata-found',
  templateUrl: './nodata-found.component.html',
  styleUrls: ['./nodata-found.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodataFoundComponent extends AppBaseComponent implements OnInit {

  constructor(public matDialog: MatDialog,
    public dialogRef: MatDialogRef<NodataFoundComponent>,
    _injector: Injector) { super(_injector);}

  ngOnInit(): void {
  }

  closeModal() {
    this.dialogRef.close();
  }

}
