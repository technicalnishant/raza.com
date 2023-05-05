import { Component, OnInit, Injector, Optional, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
//import { TextMaskModule } from 'angular2-text-mask';

import { Subscription } from 'rxjs';
import { CountriesService } from '../../core/services/country.service';
import { Country } from '../../core/models/country.model';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { SearchRatesService } from '../../rates/searchrates.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignuppopupComponent } from '../signuppopup/signuppopup.component';
import { Router, ActivatedRoute } from '@angular/router';

import { Title } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../core/services/auth.service';
import { AppBaseComponent } from '../../shared/components/app-base-component';
import { timer } from 'rxjs';
import { autoCorrectIfPhoneNumber, isValidPhoneOrEmail, isValidaEmail } from '../../shared/utilities';
import { environment } from 'environments/environment';
import { StringLiteralLike } from 'typescript';

import { PlanService } from '../../accounts/services/planService';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse'; 
import { Plan } from '../../accounts/models/plan';
import { OtpDialogComponent } from '../otp-dialog/otp-dialog.component';
/*
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
*/

@Component({
  selector: 'app-loginpopup',
  templateUrl: './loginpopup.component.html',
  styleUrls: ['./loginpopup.component.scss'],
})


export class LoginpopupComponent extends AppBaseComponent implements OnInit {

  public phonemask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public phonemask1 = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public phonemask2 = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
  public phonemask3 = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  loginForm: FormGroup;
  returnUrl: string;
  showDropdown: boolean = false;
  showForgotPass: boolean = false;
  allCountry: any[];
  countryFrom: Country[]
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  showPlaceholder: boolean = true;

  timeLeft: number = 120;
  interval;
  otpSend: boolean = false;
  subscribeTimer: number;
  forgotPasswordForm: FormGroup;
  isEnableResendOtp: boolean = false;
  captchaKey = environment.captchaKey;
  loginWith: string="phone";
  showPassWord:boolean=false;
  invalidEmail:boolean=false;
  searchicon: string = '../assets/images/search8.svg';

  reward_content: boolean = false;
  is_redirect : string="searchrates"
  fromPage : String;
  module : String;
  plan_id : String;
  plan: Plan;
  enteredPhone:number;
  enteredEmail:string;
  signupNoExist:boolean=false;
  error_response:any='Incorrect Mobile Number/Password.';
 err_forgot_pass:any='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planService: PlanService,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginpopupComponent>,
    private countryService: CountriesService,
    private searchRatesService: SearchRatesService,
    private razaEnvService: RazaEnvironmentService,
    public matDialog: MatDialog,
    public signupDialog: MatDialog,
    //private sauthService: SocialAuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    _injector: Injector
  ) {
    super(_injector); 
    this.fromPage   = (data.redirect_path)?data.redirect_path:'';
    this.module     = (data.module)?data.module:'';
    this.plan_id    = (data.plan_id)?data.plan_id:'';
    console.log(data);

  }

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }
  getmask() {
    var cuntry_id = this.currentSetting.country.CountryId;
    if (cuntry_id == 1)
      return this.phonemask1;
    else if (cuntry_id == 2)
      return this.phonemask2;
    else if (cuntry_id == 3)
      return this.phonemask3;
    else
      return this.phonemask;

  }
  ngOnInit() {

    

    this.loginForm = this.formBuilder.group({
      //username: ['', [Validators.required, Validators.pattern("^[1-9]{1}[0-9]{9}$")]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(30)]],
      captcha: [null, [Validators.required]]
    });


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';


    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
    this.getCountryFrom();


    this.forgotPasswordForm = this.formBuilder.group({
      //phoneEmailControl: ['', [Validators.required, Validators.pattern("^[1-9]{1}[0-9]{9}$")]],
      phoneEmailControl: ['', [Validators.required]],
      otp: ['']
    });

    this.runCaptcha();
     
  if( localStorage.getItem('redirect_path') && localStorage.getItem('redirect_path') == 'account/rewards' )
      {
        this.reward_content   = true;
        this.is_redirect      = localStorage.getItem('redirect_path');
        this.returnUrl        = localStorage.getItem('redirect_path');
      }
       
      if( localStorage.getItem('signup_no'))
      {
        this.loginForm.controls['username'].setValue(localStorage.getItem('signup_no'));
        localStorage.removeItem('signup_no');
        this.signupNoExist = true;
      }
      
  }
 /*
  signInWithGoogle(): void {
    this.sauthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.sauthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
*/
  closeModal() {
    this.dialogRef.close();
    localStorage.removeItem('redirect_path')
  }



  displayFn(country?: any): string | undefined {
    return country ? country.CountryName : undefined;
  }
  actionFunction() {

    this.closeModal();
  }

  onClickInput() {
    //this.searchicon = '../../assets/images/search8.svg';
  }


  closeFlagDropDown() {
    this.showDropdown = false;
  }

  openFlagDropDown() {

    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
  }

  onSelectCountrFrom(country: Country) {
    this.currentSetting.country = country;
    this.razaEnvService.setCurrentSetting(this.currentSetting);
    //this.searchRates();
    this.closeFlagDropDown();
  }

  onInputFocus() {
    this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }

  onClickClose(icon) {
    if (icon == '../assets/images/cross8.png') {
      this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
  }

  showSignup() {
    this.dialogRef.close();
    this.showSignupPopup();
  }

  showSignupPopup() {

    const signupDialogConfig = new MatDialogConfig();

    signupDialogConfig.disableClose = true;
    signupDialogConfig.id = "modal-component2";

    signupDialogConfig.data = {
      name: "logout",
      title: "Are you sure you want to logout?",
      description: "Pretend this is a convincing argument on why you shouldn't logout :)",
      actionButtonText: "Logout",
    }
    const modalDialog = this.signupDialog.open(SignuppopupComponent, signupDialogConfig);
  }


  escapeRegExp = (string) => {
    return string.replace(/[*+?^${}()|[\]\\-]/g, '');
  }

  onLoginFormSubmit(): void {

    //var phoneNumber = this.loginForm.value.username ;
    var phoneno = /^\d{10}$/;
    var phoneOrEmail = this.loginForm.value.username

   var phone = this.loginForm.value.username;

  if( phoneOrEmail.match(phoneno) )
  {
     phoneOrEmail = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+this.loginForm.value.username);
  }
  else
  {
      phoneOrEmail = autoCorrectIfPhoneNumber(this.loginForm.value.username);
  }
    
    const userPassword = this.loginForm.value.password;
     
 // this.loginForm.value.password,
    let body = {
      username: phoneOrEmail,
      phone:phone,
      password: userPassword,
      captcha: this.loginForm.value.captcha
    };

    if (!isValidPhoneOrEmail(phoneOrEmail)) {
      this.loginForm.controls['username'].setErrors({ 'invalid_input': true });
      return;
    }

    this.executeCaptcha('login').toPromise().then(token => {
      //console.log('token', token);
      let body = {
        username: phoneOrEmail,
        password: userPassword,
        captcha: token,
        phone:phone,
      };
        
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {

          if(this.fromPage   =='' ) 
          { 
            this.router.navigate([this.returnUrl]);
            this.closeModal();
          }
          else
          {
            this.callRedirect();
          }
          


        } else if (response == null) {
          this.callRedirect(); // this.router.navigateByUrl('/auth/sign-in');
        }
      },
        (error) => {

            this.error_response = error.error.error_description
        //  console.log("error message is ",error.error.error_description);

          this.loginForm.patchValue({
            captcha: ''
          });
          this.loginForm.controls['password'].setErrors({ 'invalid': true });
        });
    }
    );
  }
  ////////// Forgor password /////////
  
  callRedirect()
  {
     var path = '/'+this.module+'/'+this.fromPage
    
    

    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        if(data[0]) 
        {
          this.plan = data[0];
          if(this.plan.PlanId !='')
          path = '/'+this.module+'/'+this.fromPage+'/'+this.plan.PlanId;

            this.router.navigateByUrl(path);
            this.closeModal();

        }
        
      },
      (err: ApiErrorResponse) => {
        console.log(err)
         
        }
    );

    //this.fromPage   = (data.redirect_path)?data.redirect_path:'';
    //this.module     = (data.module)?data.module:'';
    //this.plan_id    = (data.plan_id)?data.plan_id:'';
  }
  showHideForgotForm() {

    if (this.showForgotPass) {
      this.showForgotPass = false;
    } else {
      this.showForgotPass = true;
      const phoneOrEmail = this.loginForm.value.username;
      this.forgotPasswordForm.controls['phoneEmailControl'].setValue(phoneOrEmail);
    }

  }

  submitForgotPasswordForm(): void {

   if(this.loginWith == 'email')
   {
        this.sendpasswordlink()
   }
   else
   { 

      if (!this.otpSend) {
        this.sendOtp();
        return;
      } else {
        this.loginWithOtp();
      }

    }
    

    
  }

  validateUsername(){
     
    const phoneOrEmail = this.loginForm.value.username;
    if(phoneOrEmail && phoneOrEmail !='' )
    {
     
    var replaced = phoneOrEmail.replace(/ /g, '');
     
     replaced = replaced.replace(/[a-z]/g, "");
     replaced = replaced.replace(/[A-Z]/g, "");
     replaced = replaced.replace(/[&\/\\#,+()$~%.`^'":!@_*?<>{}=|]/g, '');
     replaced = replaced.replace(/-/g, '');
     replaced = replaced.replace(/]/g, '');
     
    replaced = replaced.replace(/;/g, '');
    replaced = replaced.replace(/[\[\]']/g,'' );
    this.loginForm.controls['username'].setValue(replaced);
    }
     
  }
  validateFUsername(){
     
    const phoneOrEmail = this.forgotPasswordForm.value.phoneEmailControl;
    if(phoneOrEmail && phoneOrEmail !='' )
    {

    var replaced = phoneOrEmail.replace(/ /g, '');
    replaced = replaced.replace(/[a-z]/g, "");
    replaced = replaced.replace(/[A-Z]/g, "");
    replaced = replaced.replace(/[&\/\\#,+()$~%.`^'":!@_*?<>{}=|]/g, '');
    replaced = replaced.replace(/-/g, '');
    replaced = replaced.replace(/]/g, '');
     
    replaced = replaced.replace(/;/g, '');
    replaced = replaced.replace(/[\[\]']/g,'' );
    this.forgotPasswordForm.controls['phoneEmailControl'].setValue(replaced);
    }
  }
  loginWithOtp(): void {
    //var reciever = this.forgotPasswordForm.get('phoneEmailControl').value;
    var reciever = this.forgotPasswordForm.value.phoneEmailControl;
/*
    var phoneno = /^\d{10}$/;
  if( reciever.match(phoneno) )
  {}*/
  if(this.loginWith  != 'email')
  {
    reciever = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+this.forgotPasswordForm.get('phoneEmailControl').value);
  }
  else
  reciever = autoCorrectIfPhoneNumber(this.forgotPasswordForm.get('phoneEmailControl').value);
   
  
   

    
    let body = {
      username: reciever,
      password: this.forgotPasswordForm.get('otp').value,
      phone:this.forgotPasswordForm.get('phoneEmailControl').value
    }

    console.log(body);
    this.authService.login(body, true).subscribe((response) => {
      console.log(response);
      if (response != null) 
      {
        this.router.navigateByUrl('/account/update-password');
        this.closeModal();
      } else if (response == null) 
      {
       // this.router.navigateByUrl('/auth/sign-in');
        this.closeModal();
      } else 
      {
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
      }
    },
      (error) => 
      {
       this.error_response = error.error.error_description
      //  console.log("OTP error message = ", error.error.error_description)
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
      });
  }
 
  sendOtp(): void {
    let reciever = this.forgotPasswordForm.get('phoneEmailControl').value;

    reciever = this.escapeRegExp(reciever);
    reciever = reciever.replace(" ", "");
 
    if(this.loginWith == 'phone')
     {
      reciever = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+reciever);
      
     } 
      
     if (!isValidPhoneOrEmail(reciever)) {
      this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'invalid_input': true });
      return;
    }
 
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtp(reciever, token).subscribe(
      (res: boolean) => {
        
        if(res)
        {
          this.otpSend = true;
          this.showOtpPopup()
          this.oberserableTimer();
          this.forgotPasswordForm.get('otp').setValidators(Validators.required);
          this.forgotPasswordForm.get('phoneEmailControl').disable();
        }
       
      },
      err => {
        //console.log("Forgot error message", err.error.Message);
        this.err_forgot_pass = err.error.Message;
        this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
      }
    );
    })
  }
  showOtpPopup(){
    const  dialog =  this.matDialog.open(OtpDialogComponent);

     // Create subscription
     dialog.afterClosed().subscribe(() => {
      // Do stuff after the dialog has closed
    //  this.windowScrolling.disable();
    //this.closeModal();
  });
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
 setLoginWith(obj)
 {
   this.loginWith = obj;
   this.showPassWord = false;

   if(obj == 'email')
   {
    this.enteredPhone = this.loginForm.value.username;
    this.loginForm.controls['username'].setValue(this.enteredEmail);
   }
   if(obj == 'phone')
   {
    this.enteredEmail = this.loginForm.value.username;
    this.loginForm.controls['username'].setValue(this.enteredPhone);
   }
   
   //email phone
   //enteredPhone:number;
  //enteredEmail:string;

 }

 validateEmail()
 {
  const phoneOrEmail = this.loginForm.value.username;
 
   if(this.validateUserEmail(phoneOrEmail))
   {
      this.showPassWord = true;
      this.invalidEmail = false;
   }
   else
   {
       
      this.invalidEmail = true;
   }
 }
 
 validateUserEmail(email) {
  const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regularExpression.test(String(email).toLowerCase());
 }
  // runCaptcha() {
  //   this.recaptchaV3Service.execute('fogotpassword').subscribe(res => {
  //     console.log(res);
  //   });
  //   this.recaptchaV3Service.onExecute
  //     .subscribe((data: OnExecuteData) => {
  //       console.log('handle captcha', data);
  //     });
  // }
  sendpasswordlink(): void {
       
      var reciever = this.forgotPasswordForm.value.phoneEmailControl;
      reciever = autoCorrectIfPhoneNumber(this.forgotPasswordForm.get('phoneEmailControl').value);



      this.authService.sendpasswordlink(reciever).subscribe(
        (res: boolean) => {
          this.otpSend = true;
          
          this.showOtpPopup()
          this.dialogRef.close();
           
        },
        err => {
          this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
        }
      );

     
  }

}