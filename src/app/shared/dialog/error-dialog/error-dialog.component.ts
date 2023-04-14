import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogModel } from '../../model/error-dialog.model';

 
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
 
import { ReportanissueDialogComponent } from '../reportanissue-dialog/reportanissue-dialog.component';
import { AuthenticationService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent {

  errorModel: ErrorDialogModel;
  errorMessage:any;
  userLoggedIn:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
	private dialog: MatDialog,
  private authService: AuthenticationService,
  private router: Router,
	) {
    this.errorModel = inputData.error;
    if (this.authService.isAuthenticated()) {
		  this.userLoggedIn = true;
       
		}
  }

  closeIcon(): void {
    this.dialogRef.close();
  }
  
    reportAnIssue()
  {
    this.closeIcon();

    this.dialog.open(ReportanissueDialogComponent, {
            
      data: { message:  '' },
      panelClass: 'notification-popup'
    });

  }


  clickChatNow()
  {
   // window.location.href ='contactus';
     this.router.navigate(['contactus'])
    this.closeIcon();
  }
}
