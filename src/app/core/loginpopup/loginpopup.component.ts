import { Component, OnInit, Injector, Optional, Inject, ViewChild, ViewChildren} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
//import { TextMaskModule } from 'angular2-text-mask';
import { ElementRef, Renderer2  } from '@angular/core';
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
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
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
import { CallUsComponent } from 'app/shared/dialog/call-us/call-us.component';

import { DialogService } from '../services/dialog.service';
import { switchMap } from 'rxjs/operators';

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
  processOtp:boolean=false;

  moreOptions:boolean=false;
  form: FormGroup;
  forgotPassError:String='';
  invalidOtp:String='';
  forgotPassSubmitted:boolean=false;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  @ViewChildren('formRow') rows: any;
    error_response:any='Incorrect Mobile Number/Password.';
 err_forgot_pass:any='';
 navigateTo:String='';
 dataPhone:any='';
 quickRecharge:any;
 sendAgainMsg:boolean=false;
 rewardsRoute:any='';
 rememberMe:boolean=false;
 customerCare:any = '';
 areaCodes : any=[{"area":"255","country":"1"},{"area":"201","country":"1"},{"area":"202","country":"1"},{"area":"203","country":"1"},{"area":"205","country":"1"},{"area":"206","country":"1"},{"area":"207","country":"1"},{"area":"208","country":"1"},{"area":"209","country":"1"},{"area":"210","country":"1"},{"area":"211","country":"1"},{"area":"212","country":"1"},{"area":"213","country":"1"},{"area":"214","country":"1"},{"area":"215","country":"1"},{"area":"216","country":"1"},{"area":"217","country":"1"},{"area":"218","country":"1"},{"area":"219","country":"1"},{"area":"220","country":"1"},{"area":"223","country":"1"},{"area":"224","country":"1"},{"area":"225","country":"1"},{"area":"228","country":"1"},{"area":"229","country":"1"},{"area":"231","country":"1"},{"area":"234","country":"1"},{"area":"239","country":"1"},{"area":"240","country":"1"},{"area":"242","country":"1"},{"area":"246","country":"1"},{"area":"248","country":"1"},{"area":"251","country":"1"},{"area":"252","country":"1"},{"area":"253","country":"1"},{"area":"254","country":"1"},{"area":"256","country":"1"},{"area":"260","country":"1"},{"area":"262","country":"1"},{"area":"264","country":"1"},{"area":"267","country":"1"},{"area":"268","country":"1"},{"area":"269","country":"1"},{"area":"270","country":"1"},{"area":"272","country":"1"},{"area":"276","country":"1"},{"area":"278","country":"1"},{"area":"281","country":"1"},{"area":"283","country":"1"},{"area":"284","country":"1"},{"area":"945","country":"1"},{"area":"301","country":"1"},{"area":"302","country":"1"},{"area":"303","country":"1"},{"area":"304","country":"1"},{"area":"305","country":"1"},{"area":"307","country":"1"},{"area":"308","country":"1"},{"area":"309","country":"1"},{"area":"310","country":"1"},{"area":"311","country":"1"},{"area":"312","country":"1"},{"area":"313","country":"1"},{"area":"314","country":"1"},{"area":"315","country":"1"},{"area":"316","country":"1"},{"area":"317","country":"1"},{"area":"318","country":"1"},{"area":"319","country":"1"},{"area":"320","country":"1"},{"area":"321","country":"1"},{"area":"323","country":"1"},{"area":"325","country":"1"},{"area":"330","country":"1"},{"area":"331","country":"1"},{"area":"332","country":"1"},{"area":"334","country":"1"},{"area":"336","country":"1"},{"area":"337","country":"1"},{"area":"339","country":"1"},{"area":"340","country":"1"},{"area":"341","country":"1"},{"area":"345","country":"1"},{"area":"346","country":"1"},{"area":"347","country":"1"},{"area":"351","country":"1"},{"area":"352","country":"1"},{"area":"360","country":"1"},{"area":"361","country":"1"},{"area":"369","country":"1"},{"area":"380","country":"1"},{"area":"385","country":"1"},{"area":"386","country":"1"},{"area":"401","country":"1"},{"area":"402","country":"1"},{"area":"404","country":"1"},{"area":"405","country":"1"},{"area":"406","country":"1"},{"area":"407","country":"1"},{"area":"408","country":"1"},{"area":"409","country":"1"},{"area":"410","country":"1"},{"area":"411","country":"1"},{"area":"412","country":"1"},{"area":"413","country":"1"},{"area":"414","country":"1"},{"area":"415","country":"1"},{"area":"417","country":"1"},{"area":"419","country":"1"},{"area":"423","country":"1"},{"area":"424","country":"1"},{"area":"425","country":"1"},{"area":"430","country":"1"},{"area":"432","country":"1"},{"area":"434","country":"1"},{"area":"435","country":"1"},{"area":"438","country":"1"},{"area":"440","country":"1"},{"area":"441","country":"1"},{"area":"442","country":"1"},{"area":"443","country":"1"},{"area":"456","country":"1"},{"area":"458","country":"1"},{"area":"464","country":"1"},{"area":"469","country":"1"},{"area":"470","country":"1"},{"area":"473","country":"1"},{"area":"475","country":"1"},{"area":"478","country":"1"},{"area":"479","country":"1"},{"area":"480","country":"1"},{"area":"484","country":"1"},{"area":"500","country":"1"},{"area":"501","country":"1"},{"area":"502","country":"1"},{"area":"503","country":"1"},{"area":"504","country":"1"},{"area":"505","country":"1"},{"area":"507","country":"1"},{"area":"508","country":"1"},{"area":"509","country":"1"},{"area":"510","country":"1"},{"area":"511","country":"1"},{"area":"512","country":"1"},{"area":"513","country":"1"},{"area":"515","country":"1"},{"area":"516","country":"1"},{"area":"517","country":"1"},{"area":"518","country":"1"},{"area":"520","country":"1"},{"area":"530","country":"1"},{"area":"539","country":"1"},{"area":"540","country":"1"},{"area":"541","country":"1"},{"area":"551","country":"1"},{"area":"555","country":"1"},{"area":"557","country":"1"},{"area":"559","country":"1"},{"area":"561","country":"1"},{"area":"562","country":"1"},{"area":"563","country":"1"},{"area":"564","country":"1"},{"area":"567","country":"1"},{"area":"570","country":"1"},{"area":"571","country":"1"},{"area":"573","country":"1"},{"area":"574","country":"1"},{"area":"575","country":"1"},{"area":"580","country":"1"},{"area":"585","country":"1"},{"area":"586","country":"1"},{"area":"600","country":"1"},{"area":"601","country":"1"},{"area":"602","country":"1"},{"area":"603","country":"1"},{"area":"605","country":"1"},{"area":"606","country":"1"},{"area":"607","country":"1"},{"area":"608","country":"1"},{"area":"609","country":"1"},{"area":"610","country":"1"},{"area":"611","country":"1"},{"area":"612","country":"1"},{"area":"614","country":"1"},{"area":"615","country":"1"},{"area":"616","country":"1"},{"area":"617","country":"1"},{"area":"618","country":"1"},{"area":"619","country":"1"},{"area":"620","country":"1"},{"area":"623","country":"1"},{"area":"626","country":"1"},{"area":"627","country":"1"},{"area":"628","country":"1"},{"area":"629","country":"1"},{"area":"630","country":"1"},{"area":"631","country":"1"},{"area":"636","country":"1"},{"area":"641","country":"1"},{"area":"646","country":"1"},{"area":"649","country":"1"},{"area":"650","country":"1"},{"area":"651","country":"1"},{"area":"657","country":"1"},{"area":"660","country":"1"},{"area":"661","country":"1"},{"area":"662","country":"1"},{"area":"664","country":"1"},{"area":"667","country":"1"},{"area":"669","country":"1"},{"area":"670","country":"1"},{"area":"671","country":"1"},{"area":"678","country":"1"},{"area":"679","country":"1"},{"area":"681","country":"1"},{"area":"682","country":"1"},{"area":"684","country":"1"},{"area":"689","country":"1"},{"area":"700","country":"1"},{"area":"701","country":"1"},{"area":"702","country":"1"},{"area":"703","country":"1"},{"area":"704","country":"1"},{"area":"706","country":"1"},{"area":"707","country":"1"},{"area":"708","country":"1"},{"area":"710","country":"1"},{"area":"711","country":"1"},{"area":"712","country":"1"},{"area":"713","country":"1"},{"area":"714","country":"1"},{"area":"715","country":"1"},{"area":"716","country":"1"},{"area":"717","country":"1"},{"area":"718","country":"1"},{"area":"719","country":"1"},{"area":"720","country":"1"},{"area":"721","country":"1"},{"area":"724","country":"1"},{"area":"725","country":"1"},{"area":"727","country":"1"},{"area":"731","country":"1"},{"area":"732","country":"1"},{"area":"734","country":"1"},{"area":"737","country":"1"},{"area":"740","country":"1"},{"area":"743","country":"1"},{"area":"747","country":"1"},{"area":"754","country":"1"},{"area":"757","country":"1"},{"area":"758","country":"1"},{"area":"760","country":"1"},{"area":"762","country":"1"},{"area":"763","country":"1"},{"area":"764","country":"1"},{"area":"765","country":"1"},{"area":"767","country":"1"},{"area":"769","country":"1"},{"area":"770","country":"1"},{"area":"772","country":"1"},{"area":"773","country":"1"},{"area":"774","country":"1"},{"area":"775","country":"1"},{"area":"779","country":"1"},{"area":"781","country":"1"},{"area":"784","country":"1"},{"area":"785","country":"1"},{"area":"786","country":"1"},{"area":"787","country":"1"},{"area":"800","country":"1"},{"area":"801","country":"1"},{"area":"802","country":"1"},{"area":"803","country":"1"},{"area":"804","country":"1"},{"area":"805","country":"1"},{"area":"806","country":"1"},{"area":"808","country":"1"},{"area":"809","country":"1"},{"area":"810","country":"1"},{"area":"811","country":"1"},{"area":"812","country":"1"},{"area":"813","country":"1"},{"area":"814","country":"1"},{"area":"815","country":"1"},{"area":"816","country":"1"},{"area":"817","country":"1"},{"area":"818","country":"1"},{"area":"822","country":"1"},{"area":"828","country":"1"},{"area":"829","country":"1"},{"area":"830","country":"1"},{"area":"831","country":"1"},{"area":"832","country":"1"},{"area":"833","country":"1"},{"area":"835","country":"1"},{"area":"843","country":"1"},{"area":"844","country":"1"},{"area":"845","country":"1"},{"area":"847","country":"1"},{"area":"848","country":"1"},{"area":"849","country":"1"},{"area":"850","country":"1"},{"area":"855","country":"1"},{"area":"856","country":"1"},{"area":"857","country":"1"},{"area":"858","country":"1"},{"area":"859","country":"1"},{"area":"860","country":"1"},{"area":"862","country":"1"},{"area":"863","country":"1"},{"area":"864","country":"1"},{"area":"865","country":"1"},{"area":"866","country":"1"},{"area":"868","country":"1"},{"area":"869","country":"1"},{"area":"870","country":"1"},{"area":"872","country":"1"},{"area":"876","country":"1"},{"area":"877","country":"1"},{"area":"878","country":"1"},{"area":"880","country":"1"},{"area":"881","country":"1"},{"area":"882","country":"1"},{"area":"888","country":"1"},{"area":"898","country":"1"},{"area":"900","country":"1"},{"area":"901","country":"1"},{"area":"903","country":"1"},{"area":"904","country":"1"},{"area":"906","country":"1"},{"area":"907","country":"1"},{"area":"908","country":"1"},{"area":"909","country":"1"},{"area":"910","country":"1"},{"area":"911","country":"1"},{"area":"912","country":"1"},{"area":"913","country":"1"},{"area":"914","country":"1"},{"area":"915","country":"1"},{"area":"916","country":"1"},{"area":"917","country":"1"},{"area":"918","country":"1"},{"area":"919","country":"1"},{"area":"920","country":"1"},{"area":"925","country":"1"},{"area":"927","country":"1"},{"area":"928","country":"1"},{"area":"929","country":"1"},{"area":"931","country":"1"},{"area":"935","country":"1"},{"area":"936","country":"1"},{"area":"937","country":"1"},{"area":"939","country":"1"},{"area":"940","country":"1"},{"area":"941","country":"1"},{"area":"947","country":"1"},{"area":"949","country":"1"},{"area":"951","country":"1"},{"area":"952","country":"1"},{"area":"954","country":"1"},{"area":"956","country":"1"},{"area":"957","country":"1"},{"area":"959","country":"1"},{"area":"970","country":"1"},{"area":"971","country":"1"},{"area":"972","country":"1"},{"area":"973","country":"1"},{"area":"975","country":"1"},{"area":"976","country":"1"},{"area":"978","country":"1"},{"area":"979","country":"1"},{"area":"980","country":"1"},{"area":"984","country":"1"},{"area":"985","country":"1"},{"area":"989","country":"1"},{"area":"999","country":"1"},{"area":"204","country":"2"},{"area":"226","country":"2"},{"area":"236","country":"2"},{"area":"249","country":"2"},{"area":"250","country":"2"},{"area":"263","country":"2"},{"area":"289","country":"2"},{"area":"306","country":"2"},{"area":"343","country":"2"},{"area":"354","country":"2"},{"area":"365","country":"2"},{"area":"367","country":"2"},{"area":"368","country":"2"},{"area":"403","country":"2"},{"area":"416","country":"2"},{"area":"418","country":"2"},{"area":"431","country":"2"},{"area":"437","country":"2"},{"area":"450","country":"2"},{"area":"468","country":"2"},{"area":"474","country":"2"},{"area":"506","country":"2"},{"area":"514","country":"2"},{"area":"519","country":"2"},{"area":"548","country":"2"},{"area":"579","country":"2"},{"area":"581","country":"2"},{"area":"584","country":"2"},{"area":"587","country":"2"},{"area":"604","country":"2"},{"area":"613","country":"2"},{"area":"639","country":"2"},{"area":"647","country":"2"},{"area":"672","country":"2"},{"area":"683","country":"2"},{"area":"705","country":"2"},{"area":"709","country":"2"},{"area":"742","country":"2"},{"area":"753","country":"2"},{"area":"778","country":"2"},{"area":"780","country":"2"},{"area":"782","country":"2"},{"area":"807","country":"2"},{"area":"819","country":"2"},{"area":"825","country":"2"},{"area":"867","country":"2"},{"area":"873","country":"2"},{"area":"902","country":"2"},{"area":"905","country":"2"},{"area":"481","country":"2"}];

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
    private el: ElementRef,
    private renderer: Renderer2,
    private dialogService: DialogService,
    //private sauthService: SocialAuthService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    
    _injector: Injector
  ) {
    super(_injector); 
    this.form           = this.toFormGroup(this.formInput);
    this.fromPage       = (data.redirect_path)?data.redirect_path:'';
    this.module         = (data.module)?data.module:'';
    this.plan_id        = (data.plan_id)?data.plan_id:'';
    this.dataPhone      = (data.number)?data.number:'';
    this.quickRecharge  = (data.quickRecharge)?data.quickRecharge:false;

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
      this.setcurrentCurrency();
    });
    this.getCountryFrom();


    this.forgotPasswordForm = this.formBuilder.group({
      //phoneEmailControl: ['', [Validators.required, Validators.pattern("^[1-9]{1}[0-9]{9}$")]],
      phoneEmailControl: ['', [Validators.required]],
      otp: ['']
    });

    this.runCaptcha();
     
  if( localStorage.getItem('redirect_path') && ( localStorage.getItem('redirect_path') == 'account/rewards' || localStorage.getItem('redirect_path') == 'checkout/payment-info') )
      {
        this.reward_content   = localStorage.getItem('redirect_path') == 'account/rewards'?true:false;
        this.is_redirect      = localStorage.getItem('redirect_path');
        this.returnUrl        = localStorage.getItem('redirect_path');
        this.rewardsRoute     = localStorage.getItem('redirect_path');
      }
       
      if( localStorage.getItem('signup_no'))
      {
        this.loginForm.controls['username'].setValue(localStorage.getItem('signup_no'));
        localStorage.removeItem('signup_no');
        this.signupNoExist = true;
      }

     // { number: reciever, loginWith:'phone', quickRecharge:true }

     if(this.dataPhone !='')
     {
      
      this.forgotPasswordForm.controls['phoneEmailControl'].setValue(this.dataPhone);
      this.enteredPhone = this.dataPhone;
      this.processForgot()
      this.showForgotPass = true;
     
      this.processOtp = true;
     }

     
    if(this.data.loginWith  && this.data.loginWith == 'email')
    {
        this.loginWith        = 'email';
        this.navigateTo = this.data.navigateTo && this.data.navigateTo!=''?this.data.navigateTo:'';
        
        if(this.data.email)
        {
          this.showPassWord     = true;
          this.showForgotPass   = true;
          this.processOtp       = true;

          this.enteredPhone = this.data.email;
          this.forgotPasswordForm.controls['phoneEmailControl'].setValue(this.data.email);
          this.loginForm.controls['username'].setValue(this.data.email);
        }
    } 

    if (!this.dialogService.getIsDialogOpen()) {
     // this.dialogService.setIsDialogOpen(true);
      }
      else{
      //  this.closeModal()
      }
    this.setCookieFields()

  }

  setCookieFields()
  {
    
    if(localStorage.getItem('rememberMe') && localStorage.getItem('rememberMe') == 'rememberMe')
    {
      
     const loginwith  = localStorage.getItem('cookieLoginWith');
     const phoneEmail = localStorage.getItem('cookieLoginPhone');
     const password   = localStorage.getItem('cookieLoginPass');
     this.loginWith   = loginwith? loginwith:this.loginWith;
     this.rememberMe = true;
     if(this.loginWith == 'email')
     {
      this.showPassWord = true;
     }

      this.loginForm.controls['username'].setValue(phoneEmail);
      this.loginForm.controls['password'].setValue(password);
 
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
    this.dialogService.setIsDialogOpen(false);
    this.dialogRef.close();
   
    localStorage.removeItem('redirect_path')
  }



  displayFn(country?: any): string | undefined {
    return country ? country.CountryName : undefined;
  }
  actionFunction() 
  {

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
    this.setcurrentCurrency();
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

   onLoginFormSubmit()  {

    //var phoneNumber = this.loginForm.value.username ;
   // var phoneno = /^\d{10}$/;
    var phoneno = /^[0-9]+$/;
    var phoneOrEmail = this.loginForm.value.username

   var phone = this.loginForm.value.username;

  if( phoneOrEmail.match(phoneno) )
  {

    this.enteredPhone = phone;
     /*
      const firstThreeDigits: string = phone.toString().slice(0, 3);
      const areaMatches = this.areaCodes.filter(code => code.area === firstThreeDigits);
      if (areaMatches[0]) 
      { 
        const cntry = this.countryFrom.filter(item=>item.CountryId == areaMatches[0].country);
        const country1: Country = cntry[0]
        this.currentSetting.country = country1;
        this.razaEnvService.setCurrentSetting(this.currentSetting);

      } 
       */

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
         phone:this.currentSetting.country.CountryCode+phone,
        //phone:phoneOrEmail,
      };
        
      this.authService.login(body, false, "Y").subscribe((response) => {
        if (response != null) {

          this.setCookie(this.loginWith, phone, userPassword)
          
          

          if(this.fromPage   == '' && this.navigateTo == '') 
          { 
            this.router.navigate([this.returnUrl]);
            this.closeModal();
          }
          else
          {
            this.callRedirect();
          }
          


        } else if (response == null) {
          //this.callRedirect();  
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
          
          if(this.navigateTo !='' && this.navigateTo == 'cartpage')
          {
            this.redirect('checkout/payment-info');
           // this.router.navigate(['checkout/payment-info']); 
          }
          else
          {
            if(this.rewardsRoute !='')
            this.redirect(this.rewardsRoute);
            
            else
            this.redirect(path);
            
          
          }
            
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

 
  redirect(path)
  {
    localStorage.removeItem('redirect_path');
    this.router.navigateByUrl(path);
  }
  
  showHideForgotForm() {
    
    if (this.showForgotPass) {
      this.showForgotPass = false;
    } else 
    {

      this.moreOptions = false;
      this.forgotPassSubmitted = true;
      const phoneOrEmail = this.loginForm.value.username;
      this.forgotPasswordForm.controls['phoneEmailControl'].setValue(phoneOrEmail);
      this.showForgotPass = true;
     if(this.loginWith == 'email')
     {
          
          this.sendpasswordlink()
  
     }
    else
    {
 
       
  
        console.log("Step 11");
        if(phoneOrEmail !='')
        {

          this.enteredPhone = phoneOrEmail;
          this.processForgot()
          this.showForgotPass = true;
          console.log("Step 111");
          this.processOtp = true;
        }
        else{
          this.showForgotPass = true;
          this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'required': true });
          this.processOtp = false;
        }

      }
    }

  }

  processForgot()
  {
  
    let reciever = this.forgotPasswordForm.get('phoneEmailControl').value;
    this.enteredPhone = reciever;
    reciever = this.escapeRegExp(reciever);
    reciever = reciever.replace(" ", "");
 
    if(this.loginWith == 'phone')
     {
      reciever = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+reciever);
      
     } 
      
     if (!isValidPhoneOrEmail(reciever)) 
     {
      this.showForgotPass = true;
      console.log("Step 2");
      this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'invalid': true });
      return;
    }

    this.processOtp = true;
   
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtp(reciever, token).subscribe(
      (res: boolean) => 
      {
        this.processOtp = true;
        
      },
      err => 
      {
         this.processOtp = false;
         this.showForgotPass = true;
          this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
          this.err_forgot_pass = (err.error.Message)?err.error.Message:'There must be some issue please try again after some time.';
      }
    );
    })
  }

  processForgot1()
  {
    this.sendAgainMsg = false;
    let reciever = this.forgotPasswordForm.get('phoneEmailControl').value;
    this.enteredPhone = reciever;
    reciever = this.escapeRegExp(reciever);
    reciever = reciever.replace(" ", "");
 
    if(this.loginWith == 'phone')
     {
      reciever = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+reciever);
      
     } 
      
     if (!isValidPhoneOrEmail(reciever)) 
     {
      this.showForgotPass = true;
      console.log("Step 2");
      this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'invalid': true });
      return;
    }

    this.processOtp = true;
   
    if(this.loginWith == 'email')
    {
       
        this.authService.sendpasswordlink(reciever).subscribe(
          (res: boolean) => {
            this.otpSend = true;
            this.processOtp = true;
            this.sendAgainMsg = true;
            
          },
          err => {
            this.processOtp = false;
              this.showForgotPass = true;
            this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
          }
        );


    }
    else
    {
        this.executeCaptcha('login').toPromise().then(token => {
        this.authService.sendOtp(reciever, token).subscribe(
            (res: boolean) => 
            {
              this.processOtp = true;
              this.sendAgainMsg = true;
            },
            err => 
            {
              this.processOtp = false;
              this.showForgotPass = true;
                this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
                this.err_forgot_pass = (err.error.Message)?err.error.Message:'There must be some issue please try again after some time.';
            }
          );
        })
    }

  }
  processClose()
  {
    if(this.moreOptions == true)
    {
      this.moreOptions = false;
      return false;
    }

    if(this.processOtp == true)
    {
      this.processOtp = false;
      return false;
    }
 

  }
  onOtpChange()
  {

  }
  submitForgotPasswordForm(): void {

    this.moreOptions = false;
    this.forgotPassSubmitted = true;
   if(this.loginWith == 'email')
   {
        this.sendpasswordlink()

   }
   else
   { 
    this.processForgot();
      // if (!this.otpSend) 
      // {
        
      //   this.processForgot();
        
      // }
      //  else
      //  {
      //   this.loginWithOtp();
      // }

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
      if(this.loginWith  != 'email')
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

    
    this.authService.login(body, true).subscribe((response) => {
      
      if (response != null) 
      {
        //this.router.navigateByUrl('/account/update-password');
        

        if(this.navigateTo !='' && this.navigateTo == 'cartpage')
          {
            this.router.navigate(['checkout/payment-info']); 
          }
          else{
            this.router.navigate([this.returnUrl]);
          }
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
       this.invalidOtp = error.error.error_description;
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

    let email = this.forgotPasswordForm.get('phoneEmailControl').value


    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "otp-confirmation1";
     
      dialogConfig.data = {
        email: email, 
        loginWit:this.loginWith
      }

    const  dialog =  this.matDialog.open(OtpDialogComponent, dialogConfig);

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
    
   this.rememberMe = false;
  this.loginForm.controls['username'].setValue('');
  this.loginForm.controls['password'].setValue('');
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
      
       if(!this.validateUserEmail(this.forgotPasswordForm.get('phoneEmailControl').value))
       {
        this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
        this.forgotPasswordForm.get('phoneEmailControl').errors.pattern = true;
       }
       else
       {
      //  reciever = autoCorrectIfPhoneNumber(this.forgotPasswordForm.get('phoneEmailControl').value);
          this.authService.sendpasswordlink(reciever).subscribe(
            (res: boolean) => {
              this.otpSend = true;
            // this.processOtp = true;
              this.showOtpPopup()
              this.dialogRef.close();
              
            },
            err => {
              this.processOtp = false;
              this.showForgotPass = true;
              this.forgotPasswordForm.get('phoneEmailControl').setErrors({ 'invalid': true });
            }
          );
       }

     

     
  }



  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }

  keyUpEvent(event, index) {
    this.invalidOtp = '';
    let pos = index;
   
    if ((event.keyCode === 8 && event.which === 8) || (event.keyCode === 37 && event.which === 37)) {
      pos = index - 1 ;
    } else {
      pos = index + 1 ;
    }
    
    if (pos > -1 && pos < this.formInput.length ) {
      this.rows._results[pos].nativeElement.focus();
      
    }
    if((event.target as HTMLInputElement).value == '')
    {
      return false
    }
    if(pos == this.formInput.length)
      this.onSubmit()

  }


  keyPressEvent(event, index) { }

  resendCode()
  {
    this.invalidOtp = '';
    this.form.reset();
    // this.form.value.input1= '';
    // this.form.value.input2= '';
    // this.form.value.input3= '';
    // this.form.value.input4= '';
    // this.form.value.input5= '';
    // this.form.value.input6= '';
  }
 

  onSubmit(): void {
    
    let otp = this.form.value.input1+this.form.value.input2+this.form.value.input3+this.form.value.input4+this.form.value.input5+this.form.value.input6;
    var reciever = this.forgotPasswordForm.value.phoneEmailControl;
   
  if(this.loginWith  != 'email')
  {
    reciever = autoCorrectIfPhoneNumber(this.currentSetting.country.CountryCode+this.forgotPasswordForm.get('phoneEmailControl').value);
  }
  else
  reciever = autoCorrectIfPhoneNumber(this.forgotPasswordForm.get('phoneEmailControl').value);
   
  
   

    
    let body = {
      username: reciever,
      password: otp,
      phone:this.forgotPasswordForm.get('phoneEmailControl').value
    }

   
    this.authService.login(body, true).subscribe((response) => {
      
      if (response != null) 
      {
       // this.router.navigateByUrl('/account/update-password');

       if(this.navigateTo !='' && this.navigateTo == 'cartpage')
          {
            this.router.navigate(['checkout/payment-info']); 
          }
          else
          this.router.navigate([this.returnUrl]);
       //if(!this.quickRecharge)
       

        this.closeModal();
      } 
      else if (response == null) 
      {
       // this.router.navigateByUrl('/auth/sign-in');
         this.closeModal();
      } else 
      {
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
      }
    },
      (error) => {
        this.invalidOtp = error.error.error_description
        this.forgotPasswordForm.controls['otp'].setErrors({ 'invalid': true });
      });
  }

  changeNumber()
  {
    this.processOtp = false;
    this.showForgotPass = true;
    this.invalidOtp = ''; 
    this.error_response='';
    this.err_forgot_pass = '';
  }

  processWith(obj:any)
  {
    this.loginWith = obj;
    this.processOtp = false;
    this.forgotPasswordForm.controls['phoneEmailControl'].setValue('');
    this.err_forgot_pass = '';
    this.forgotPasswordForm.controls['phoneEmailControl'].setErrors({ 'required': false });
  }

  chatWithUs()
  {
    this.closeModal();
    this.matDialog.open(CallUsComponent);
    // document.getElementsByClassName("LPMcontainer") as HTMLElement
    // let element:HTMLElement = document.getElementsByClassName('LPMcontainer') as HTMLElement;
    // window.lpTag.engage('myButton', { name: 'John', age: 25 }, () => {
    //   console.log('Chat triggered!');
    // });

  }
  formattedNumber(obj)
  {
    const phoneNumber = obj;
    const formattedNumber = phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    return formattedNumber; // Output: 312 975 8545
 
  }

  setCookie(loginWith, phone, userPassword)
  {
    
    if(this.rememberMe)
    {
      localStorage.setItem('cookieLoginWith', loginWith);
      localStorage.setItem('cookieLoginPhone', phone);
      localStorage.setItem('cookieLoginPass', userPassword);
      localStorage.setItem('rememberMe', 'rememberMe');
    }
  }
  setRememberme(obj:boolean)
  {
    this.rememberMe = obj;
 
  }   
  
  
  
  setcurrentCurrency()
  {
    if(this.currentSetting.country.CountryId == 1)
    {
  
      this.customerCare = '1-877.463.4233';
    }
      
      if(this.currentSetting.country.CountryId == 2)
      {
       
        this.customerCare='1-800.550.3501';
      }
      
      if(this.currentSetting.country.CountryId == 3)
      {
        
        this.customerCare='44 800-041-8192';

      }
     
      if(this.currentSetting.country.CountryId == 8)
      {
         
        this.customerCare='61283173403';
      }
    
      if(this.currentSetting.country.CountryId == 20)
      {
        
        this.customerCare='6498844133';
      }
    
      if(this.currentSetting.country.CountryId == 26)
      {
        
        this.customerCare='1-877.463.4233';
      } 
  }
          
}