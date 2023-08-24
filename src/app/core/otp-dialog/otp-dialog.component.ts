import { Component, OnInit,Injector, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { AuthenticationService } from '../services/auth.service';
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';
@Component({
  selector: 'app-otp-dialog',
  templateUrl: './otp-dialog.component.html',
  styleUrls: ['./otp-dialog.component.scss']
})
export class OtpDialogComponent implements OnInit {
  otpSend:boolean=false;
  userEmail:string='';
  loginWith:string='';
  moreOptions:boolean=false;
  constructor(
    private authService: AuthenticationService,
    public dialogRef: MatDialogRef<OtpDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userEmail = this.data.email;
    this.loginWith = this.data.loginWith;
  }

  showMoreOptions()
  {
    this.moreOptions=!this.moreOptions
  }

  sendPasswordAgain()
  {
    
    this.authService.sendpasswordlink(this.userEmail).subscribe(
      (res: boolean) => {
         this.otpSend = true;
       // this.processOtp = true;
          
        this.dialogRef.close();
         
      },
      err => {
        
      }
    );
  }


  goToLogin()
  {
     const dialogConfig = new MatDialogConfig();
       dialogConfig.data = {
        loginWith: "email",
        email: this.userEmail 
      }
     
      const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
      this.dialogRef.close();
  }


  loginWithPhone()
  {
     const dialogConfig = new MatDialogConfig();
       dialogConfig.data = {
        loginWith: "phone" 
      }
      const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
      this.dialogRef.close();
  }

  


}
