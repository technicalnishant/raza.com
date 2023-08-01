import { Component, OnInit, ChangeDetectionStrategy, Injector } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { timer } from 'rxjs';
import { Router } from '@angular/router';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { RazaLayoutService } from '../../core/services/raza-layout.service';
import { autoCorrectIfPhoneNumber, isValidPhoneOrEmail } from '../../shared/utilities';
// import { OnExecuteData, ReCaptchaV3Service } from 'ng-recaptcha';
//import { environment } from 'environments/environment';

import { environment } from '../../../environments/environment';
import { AppBaseComponent } from '../../shared/components/app-base-component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends AppBaseComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private razaSnackBarService: RazaSnackBarService,
    private razaLayoutService: RazaLayoutService,
    //private recaptchaV3Service: ReCaptchaV3Service,
	_injector: Injector
  ) {super(_injector); }

  timeLeft: number = 120;
  interval;
  otpSend: boolean = false;
  subscribeTimer: number;
  forgotPasswordForm: FormGroup;
  isEnableResendOtp: boolean = false;
  phoneEmailError : any='';
  passError:any='';
  ngOnInit() {
    this.razaLayoutService.setFixedHeader(true);
    this.forgotPasswordForm = this.formBuilder.group({
      phoneEmailControl: ['', [Validators.required]],
      otp: ['']
    });

   // this.runCaptcha();
  }

  submitForgotPasswordForm(): void {
    if (!this.forgotPasswordForm.valid)
      return;

    if (!this.otpSend) {
      this.sendOtp();
      return;
    } else {
      this.loginWithOtp();
    }
  }
  openLoginPopup()
  {
    this.authService.loginPopup();
  }
  loginWithOtp(): void {
    const reciever = autoCorrectIfPhoneNumber(this.forgotPasswordForm.get('phoneEmailControl').value);
    let body = {
      username: reciever,
      password: this.forgotPasswordForm.get('otp').value
    }

    this.authService.login(body, true).subscribe((response) => {
      if (response != null) {
        this.router.navigateByUrl('/account/update-password');
      } else if (response == null) {
        this.openLoginPopup();
      } else {
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
      }
    },
      (error) => {
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
        
        this.passError = error.error.error_description
      });
  }

  sendOtp(): void {
    let reciever = this.forgotPasswordForm.get('phoneEmailControl').value;
    reciever = autoCorrectIfPhoneNumber(reciever);

    if (!isValidPhoneOrEmail(reciever)) {
      this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'invalid_input': true });
      return;
    }
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtp(reciever, token).subscribe(
      (res: boolean) => {
        this.otpSend = true;
        this.oberserableTimer();
        this.forgotPasswordForm.get('otp').setValidators(Validators.required);
        this.forgotPasswordForm.get('phoneEmailControl').disable();
      },
      err => {
        
        this.phoneEmailError = err.error.Message;
        this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
      }
    );
  
  })
  }


  oberserableTimer() {
    this.isEnableResendOtp = false;
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      if (this.timeLeft - val > -1) {
        this.subscribeTimer = this.timeLeft - val;
      }
      else {
        abc.unsubscribe();
        this.isEnableResendOtp = true;
      }
    });
  }
/*
  runCaptcha() {
    this.recaptchaV3Service.execute('fogotpassword').subscribe(res => {
      console.log(res);
    });
    this.recaptchaV3Service.onExecute
      .subscribe((data: OnExecuteData) => {
        console.log('handle captcha', data);
      });
  }*/

}
