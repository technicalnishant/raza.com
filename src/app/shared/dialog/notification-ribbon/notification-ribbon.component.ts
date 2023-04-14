import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-ribbon',
  templateUrl: './notification-ribbon.component.html',
  styleUrls: ['./notification-ribbon.component.scss']
})
export class NotificationRibbonComponent implements OnInit {

  message: string;
  closable: boolean;
  type: string;
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
    private _snackRef: MatSnackBarRef<NotificationRibbonComponent>) { }

  ngOnInit() {
    this.message = this.data.message;
   // this.closable = this.data.closable;
    this.type = this.data.type;
    
  }

  close() {
    this._snackRef.dismiss();
  }

  getAlertClass() {
    let cssClass;
    if (this.type === 'warning') {
      cssClass = 'alert-warning'
    }
    else if (this.type === 'success') {
      cssClass = 'alert-success'
    } else if (this.type === 'error') {
      cssClass = 'alert-danger';
    }

    return `alert-notification ${cssClass}`;
  }

}
