import { Component, OnInit, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CountriesService } from '../../../core/services/country.service';
import { MatDialog } from '@angular/material/dialog';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { isValidaEmail, isValidPhoneNumber, autoCorrectIfPhoneNumber, isValidPhoneOrEmail } from '../../../shared/utilities';
import { environment } from '../../../../environments/environment';
import { AppBaseComponent } from '../../../shared/components/app-base-component';
@Component({
  selector: 'app-auto-signin',
  templateUrl: './auto-signin.component.html',
  styleUrls: ['./auto-signin.component.scss']
})
export class AutoSigninComponent extends AppBaseComponent implements OnInit {

  loginForm: FormGroup;
  returnUrl: string;
  captchaKey = environment.captchaKey;
  userPhone : any;
  userPass : any;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private countriesService: CountriesService,
    private dialog: MatDialog,
    private snackBarService: RazaSnackBarService,
    _injector: Injector
  ) {
    super(_injector);
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      captcha: [null, [Validators.required]]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
    this.userPhone = this.route.snapshot.params['userPhone'];
    this.userPass = this.route.snapshot.params['userPass'];
     
    this.autoLoginUser()
  }
  openLoginPopup()
  {
    this.authService.loginPopup();
  }
  autoLoginUser():void
  {
    const phoneOrEmail = this.userPhone;
    this.executeCaptcha('login').toPromise().then(token => {
      console.log('token', token);
      let body = {
        username: phoneOrEmail,
        password: this.userPass,
        captcha: token
      };
     
      // console.log('body', body);
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {
          this.router.navigate([this.returnUrl]);
        } else if (response == null) {
         
          this.openLoginPopup()
        }
      },
        (error) => {
          this.loginForm.patchValue({
            captcha: ''
          });
          this.loginForm.controls['password'].setErrors({ 'invalid': true });
        });
    }
    );
  }
   

}
