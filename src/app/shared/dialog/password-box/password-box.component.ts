import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { LoginpopupComponent } from 'app/core/loginpopup/loginpopup.component';

@Component({
  selector: 'app-password-box',
  templateUrl: './password-box.component.html',
  styleUrls: ['./password-box.component.scss']
})
export class PasswordBoxComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PasswordBoxComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }


  closeIcon(): void {
    this.dialogRef.close();
  }

  onPasswordFormSubmit() {
    if (!this.passwordForm.valid) {
      return;
    }

    const body = {
      username: this.data.phoneNumber,
      password: this.passwordForm.value.password
    }

    this.authService.login(body).toPromise()
      .then((res) => {
        if (res) {
          this.dialogRef.close(res );
        }
      }).catch(err => {
        this.passwordForm.controls['password'].setErrors({ 'invalid': true });
      });

  }

  navigateToForgotPassword() {
    this.dialogRef.close(null);
    //this.router.navigateByUrl('/auth/forgot-password');
    const phoneNumber = this.data.phoneNumber;  // Example phone number
    const phoneNumberAsString = phoneNumber.toString();  // Convert to string
    const newPhoneNumberAsString = phoneNumberAsString.slice(1);  // Remove first character
   
    const dialogConfig = new MatDialogConfig();
   
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "350px";
    dialogConfig.width = "600px";
    dialogConfig.data = 
    {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      redirect_path:'checkout/payment-info',
       
      number:newPhoneNumberAsString,
      actionButtonText: "Logout",
    }
     
    const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
  }
}
