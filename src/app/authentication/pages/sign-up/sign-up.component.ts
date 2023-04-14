import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CountriesService } from '../../../core/services/country.service';
import { MatDialog } from '@angular/material/dialog';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { RegisterCustomerModel } from '../../../core/models/register-customer.model';
import { Observable } from 'rxjs';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
//import { isNullOrUndefined } from 'util';
import { OtpConfirmationComponent } from '../../../shared/dialog/otp-confirmation/otp-confirmation.component';
import { Country } from '../../../core/models/country.model';
import { isValidaEmail, isValidPhoneOrEmail, isNullOrUndefined } from '../../../shared/utilities';
import { AppBaseComponent } from '../../../shared/components/app-base-component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent extends AppBaseComponent implements OnInit {
  returnUrl: string;
  signUpForm: FormGroup;
  countries: Country[];


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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
    this.signUpForm = this.formBuilder.group({
      country: ['', Validators.required],
      phoneOrEmail: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.getCountries();
  }

  getCountries() {
    this.countriesService.getFromCountries().subscribe(
      (res: Country[]) => {
        this.countries = res.splice(0, 3);
      }
    )
  }



  onSignupFormSubmit() {
    //if (!this.signUpForm.valid) {
     // return;
    //}

    let phoneToRegister: string = this.signUpForm.value.phoneOrEmail;
    const country: Country = this.signUpForm.value.country;


    if (!phoneToRegister.startsWith(`+${country.CountryCode}`))
      phoneToRegister = `+${phoneToRegister}`;
    else if (!phoneToRegister.startsWith(`+${country.CountryCode}`))
      phoneToRegister = `+${country.CountryCode}${phoneToRegister}`;

    if (!isValidPhoneOrEmail(phoneToRegister)) {
      this.signUpForm.controls['phoneOrEmail'].setErrors({ 'invalid_input': true });
      return;
    }

    this.isEmailOrPhoneExist(country.CountryCode, phoneToRegister).toPromise()
      .then(res => {
        this.registerUsingPhoneNumber(phoneToRegister, country);
      }).catch((err: ApiErrorResponse) => {
        this.signUpForm.controls['phoneOrEmail'].setErrors({ 'already_exist': true });
      });
  }


  private registerUsingPhoneNumber(phoneNumber: string, country: Country) {
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtpForRegister(phoneNumber, token).toPromise()
      .then(res => {
        this.openOtpConfirmDialog(phoneNumber);
      })
    });
  }

  private openOtpConfirmDialog(phoneNumber: string) {
    const dialogOtpConfirm = this.dialog.open(OtpConfirmationComponent,
      {
        data: {
          phoneNumber: phoneNumber,
        }
      });

    dialogOtpConfirm.afterClosed().subscribe(otp => {
      if (!isNullOrUndefined(otp)) {
        this.registerAndLoginUser(phoneNumber, otp);
      }
    },
      err => { },
    )
  }

  private isEmailOrPhoneExist(countryCode: string, emailOrPhone: string): Observable<boolean | ApiErrorResponse> {
    return this.executeCaptcha('IsExist').pipe(switchMap(token =>
      this.authService.isEmailOrPhoneExist(countryCode, emailOrPhone, token)
    ));
  }

  registerAndLoginUser(phoneNumber: string, otp: string) {
    //user Register and logIn.  navigate to payment Info.
    let tempEmail = `${phoneNumber.replace('+', '')}@raza.temp`;
    let primaryPhoneNumber = phoneNumber;

    if (isValidaEmail(phoneNumber)) {
      tempEmail = phoneNumber.replace('+', '');
      primaryPhoneNumber = "";
    }
    let promo_code = localStorage.getItem('promo_code');
	  

    const registerModel: RegisterCustomerModel = {
      emailAddress: tempEmail,
      password: otp,
      firstName: '',
      lastName: '',
      primaryPhone: primaryPhoneNumber,
      alternatePhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: this.signUpForm.value.country.CountryId,
      aboutUs: '',
      refererEmail: '',
      callingCountryId: 314,
      isQuickSignUp: true,
      PromoCode:(typeof promo_code !== 'undefined')?promo_code:''
    }

    this.authService.register(registerModel).toPromise().then(
      (res: boolean) => {
        if (res) {
          const loginBody = {
            username: tempEmail,
            password: otp
          };
          this.authService.login(loginBody).toPromise().then(user => {
            this.redirectToRatePage();
          })
        }
      }
    )
  }

  redirectToRatePage() {
    this.router.navigate(['searchrates']);
  }

  login() {
    this.router.navigate(['auth/sign-in']);
  }
}
