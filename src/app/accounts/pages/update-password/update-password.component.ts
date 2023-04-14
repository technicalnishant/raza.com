import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ConfirmPasswordValidator } from '../../../shared/validators/confirm-password-validator';
import { UpdatePasswordSuccessDialog } from '../../dialog/update-password-success/update-password-success.dialog';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private razaLayoutService: RazaLayoutService,
  ) { }

  updatePasswordForm: FormGroup;

  ngOnInit() {
    this.razaLayoutService.setFixedHeader(true);
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }

  submitUpdatePasswordForm(): void {
    if (this.updatePasswordForm.valid) {
      let password = this.updatePasswordForm.get('password').value;
      this.authService.updatePassword(password).subscribe(
        (res: boolean) => {
          if (res)
            this.dialog.open(UpdatePasswordSuccessDialog);
          this.updatePasswordForm.reset();
        }
      )
    }
  }
}
