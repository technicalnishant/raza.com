import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
          this.dialogRef.close(true);
        }
      }).catch(err => {
        this.passwordForm.controls['password'].setErrors({ 'invalid': true });
      });

  }

  navigateToForgotPassword() {
    this.dialogRef.close(null);
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
