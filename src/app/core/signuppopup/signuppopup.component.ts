import { Component, OnInit, Injector, NgModule } from '@angular/core';
//import { TextMaskModule } from 'angular2-text-mask';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../core/services/auth.service';
import { CountriesService } from '../../core/services/country.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { RegisterCustomerModel } from '../../core/models/register-customer.model';
import { Observable, Subscription } from 'rxjs';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';

import { OtpConfirmationComponent } from '../../shared/dialog/otp-confirmation/otp-confirmation.component';
import { Country } from '../../core/models/country.model';
import { isValidaEmail, isValidPhoneOrEmail, isNullOrUndefined } from '../../shared/utilities';
import { AppBaseComponent } from '../../shared/components/app-base-component';
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';



import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { SearchRatesService } from '../../rates/searchrates.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { switchMap } from 'rxjs/operators';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
 


@Component({
  selector: 'app-signuppopup',
  templateUrl: './signuppopup.component.html',
  styleUrls: ['./signuppopup.component.scss'],
})

export class SignuppopupComponent extends AppBaseComponent implements OnInit {
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  returnUrl: string;
  signUpForm: FormGroup;
  countries: Country[];
  showPinBox: boolean = false;

  showDropdown: boolean = false;
  allCountry: any[];
  countryFrom: Country[]
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  showPlaceholder: boolean = true;
  searchicon: string = '../../../assets/images/search8.svg';
  reward_content: boolean = false;
  is_redirect : string="searchrates"
  constructor(private router: Router,
    public dialogRef: MatDialogRef<SignuppopupComponent>,
    private route: ActivatedRoute,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private countriesService: CountriesService,
    private dialog: MatDialog,
    private snackBarService: RazaSnackBarService,
    public loginDialog: MatDialog,

    private countryService: CountriesService,
    private searchRatesService: SearchRatesService,
    private razaEnvService: RazaEnvironmentService,

    _injector: Injector
  ) {
    super(_injector);
  }

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
    this.signUpForm = this.formBuilder.group({
      // country: ['', Validators.required],
      //phoneOrEmail: ['', [Validators.required, Validators.minLength(6), Validators.pattern("^[1-9]{1}[0-9]{9}$")]],
      phoneOrEmail: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['']
    });
    this.getCountries();

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
    this.getCountryFrom();

    
   // if( localStorage.getItem('redirect_path') && localStorage.getItem('redirect_path') == 'account/rewards' )
    if( localStorage.getItem('redirect_path') && ( localStorage.getItem('redirect_path') == 'account/rewards' || localStorage.getItem('redirect_path') == 'checkout/payment-info') )
    {
      this.reward_content = true;
      this.is_redirect = localStorage.getItem('redirect_path');
    }

  }

  getCountries() {
    this.countriesService.getFromCountries().subscribe(
      (res: Country[]) => {
        this.countries = res.splice(0, 3);
      }
    )
  }
  


  openFlagDropDown() {

    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
  }
  closeFlagDropDown() {
    this.showDropdown = false;
    
   
  }
  onSelectCountrFrom(country: Country) {
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
    //this.searchRates();
    this.closeFlagDropDown();
  }

  onInputFocus() {
    this.searchicon = '../../../assets/images/search8.svg';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }

  onClickClose(icon) {

    this.showDropdown = false;
  }



  onSignupFormSubmit() {

    if (!this.signUpForm.valid) {
      return;
    }

    let phoneToRegister: string = this.signUpForm.value.phoneOrEmail;
    //const country: Country = this.signUpForm.value.country;
    const country: Country = this.currentSetting.country;


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
       // this.snackBarService._openSnackBar("Number already registered, please login.", "warning", false);
      // if(confirm('Number already registered, please login.')) 
        localStorage.setItem("signup_no", this.signUpForm.value.phoneOrEmail);
       this.showLogin();
        
        
      });
  }

  private registerUsingPhoneNumber(phoneNumber: string, country: Country) {
    this.executeCaptcha('login').toPromise().then(token => {
      this.showPinBox = true;
    this.authService.sendOtpForRegister(phoneNumber, token).toPromise()
      .then(res => {
        //this.openOtpConfirmDialog(phoneNumber);
       // this.dialog.open(OtpDialogComponent);
        this.showPinBox = true;
      });
    })
  }

  resendOtp() {
    let phoneToRegister: string = this.signUpForm.value.phoneOrEmail;
    // const country: Country = this.signUpForm.value.country;
    const country: Country = this.currentSetting.country
    this.registerUsingPhoneNumber(phoneToRegister, country);
  }
  onOtpConfirmFormSubmit() {
    let phoneNumber = this.signUpForm.value.phoneOrEmail;
    let otpVal = this.signUpForm.value.otp;
    this.executeCaptcha('login').toPromise().then(token => {
      
    this.authService.verifyOtp(this.signUpForm.value.phoneOrEmail, this.signUpForm.value.otp, token).toPromise()
      .then((res: boolean) => {
        
        if (res) {
          
          // console.log("Valid Otp.");
          this.closeModal();
          this.registerAndLoginUser(phoneNumber, otpVal);
        } else {
          console.log("Invalid Otp.");
        }
      });
    });
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
      country: this.currentSetting.country.CountryId,
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
    if(this.is_redirect == 'account/rewards')
    {
      localStorage.setItem("auto_action", "SubmitReward");
    }
    this.closeModal();
    localStorage.removeItem('redirect_path');
    this.router.navigate([this.is_redirect]);
    
  }

  actionFunction() {

    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
    localStorage.removeItem('redirect_path')
  }

  showLogin() {
    this.dialogRef.close();
    this.loginPopup();
  }

  loginPopup() 
  {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-login";
    // dialogConfig.height = "350px";
    // dialogConfig.width = "600px";
    dialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",

    }

    const modalDialog = this.loginDialog.open(LoginpopupComponent, dialogConfig);
  }

  validateSignupUsername(){
     
    const phoneOrEmail = this.signUpForm.value.phoneOrEmail;
    var replaced = phoneOrEmail.replace(/ /g, '');
    replaced = replaced.replace(/[a-z]/g, "");
    replaced = replaced.replace(/[A-Z]/g, "");
    replaced = replaced.replace(/[&\/\\#,+()$~%.`^'":!@_*?<>{}=|]/g, '');
    replaced = replaced.replace(/-/g, '');
    replaced = replaced.replace(/]/g, '');
     
    replaced = replaced.replace(/;/g, '');
    replaced = replaced.replace(/[\[\]']/g,'' );
    this.signUpForm.controls['phoneOrEmail'].setValue(replaced);
     
  }
}
