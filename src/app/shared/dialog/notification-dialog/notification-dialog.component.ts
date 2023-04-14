import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportanissueDialogComponent } from '../reportanissue-dialog/reportanissue-dialog.component';
import { AuthenticationService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss']
})
export class NotificationDialogComponent implements OnInit {

  message: string;
  closable: boolean;
  type: string;
  userLoggedIn:boolean = false;
  //constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<NotificationDialogComponent>,
  private dialog: MatDialog,
  private authService: AuthenticationService,
  private router: Router,
    ) { }
    
  ngOnInit() {

    if (this.authService.isAuthenticated()) {
		  this.userLoggedIn = true;
       
		}

    console.log(this.data);
    this.message = this.data.message;
    if(this.message != '')
    {
      this.message = this.message.toLowerCase();
      this.message = this.message.charAt(0).toUpperCase() + this.message.slice(1);
    }
   
   // this.closable = this.data.closable;
   // this.type = this.data.type;
  }

  close() {
   // this._snackRef.dismiss();
    this.dialogRef.close();
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

  reportAnIssue()
  {
    this.close();

    this.dialog.open(ReportanissueDialogComponent, {
            
      data: { message:  '' },
      panelClass: 'notification-popup'
    });

  }
  clickChatNow()
  {
    //window.location.href ='contactus';
    this.router.navigate(['contactus'])
    this.close();
  }
  

}
