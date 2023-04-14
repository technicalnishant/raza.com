import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { ConfirmPasswordValidator } from '../../../shared/validators/confirm-password-validator';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.html',
})
export class UpdatePasswordDialog implements OnInit {
  updatePasswordForm: FormGroup;

  isDisplayChangePassword: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private razaSnackBarService: RazaSnackBarService,
    private authService: AuthenticationService
  ) {
    
  }

  ngOnInit() {
    this.updatePasswordForm = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
     
    this.changePassword();
  }


  onUpdatePasswordForm(): void {

    if (!this.updatePasswordForm.valid) {
      return;
    }
    this.dialogRef.close();
    this.updatePassword(this.updatePasswordForm.get('password').value).subscribe();
    this.razaSnackBarService.openSuccess("Password successfully updated.");
  }

  changePassword() {
    this.isDisplayChangePassword = !this.isDisplayChangePassword;
    if (this.isDisplayChangePassword) {

      this.updatePasswordForm.get('password').setValidators(Validators.required);
      this.updatePasswordForm.get('confirmPassword').setValidators(Validators.required);
      this.updatePasswordForm.setValidators(ConfirmPasswordValidator.MatchPassword)
    } else {
      this.updatePasswordForm.clearValidators();
      this.updatePasswordForm.get('password').clearValidators();
      this.updatePasswordForm.get('confirmPassword').clearValidators();
      this.updatePasswordForm.get('password').updateValueAndValidity();
      this.updatePasswordForm.get('confirmPassword').updateValueAndValidity();
      this.updatePasswordForm.updateValueAndValidity();
    }
  }

  updatePassword(newPassword: string): Observable<boolean> {
    return this.authService.updatePassword(newPassword);
  }

  closeIcon(): void {
    this.dialogRef.close();
  }

}
