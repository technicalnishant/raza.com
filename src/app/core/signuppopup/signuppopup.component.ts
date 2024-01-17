import { Component, OnInit, Injector, NgModule, ViewChildren } from '@angular/core';
//import { TextMaskModule } from 'angular2-text-mask';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
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
  areaCodes : any=[{"area":"255","country":"1"},{"area":"201","country":"1"},{"area":"202","country":"1"},{"area":"203","country":"1"},{"area":"205","country":"1"},{"area":"206","country":"1"},{"area":"207","country":"1"},{"area":"208","country":"1"},{"area":"209","country":"1"},{"area":"210","country":"1"},{"area":"211","country":"1"},{"area":"212","country":"1"},{"area":"213","country":"1"},{"area":"214","country":"1"},{"area":"215","country":"1"},{"area":"216","country":"1"},{"area":"217","country":"1"},{"area":"218","country":"1"},{"area":"219","country":"1"},{"area":"220","country":"1"},{"area":"223","country":"1"},{"area":"224","country":"1"},{"area":"225","country":"1"},{"area":"228","country":"1"},{"area":"229","country":"1"},{"area":"231","country":"1"},{"area":"234","country":"1"},{"area":"239","country":"1"},{"area":"240","country":"1"},{"area":"242","country":"1"},{"area":"246","country":"1"},{"area":"248","country":"1"},{"area":"251","country":"1"},{"area":"252","country":"1"},{"area":"253","country":"1"},{"area":"254","country":"1"},{"area":"256","country":"1"},{"area":"260","country":"1"},{"area":"262","country":"1"},{"area":"264","country":"1"},{"area":"267","country":"1"},{"area":"268","country":"1"},{"area":"269","country":"1"},{"area":"270","country":"1"},{"area":"272","country":"1"},{"area":"276","country":"1"},{"area":"278","country":"1"},{"area":"281","country":"1"},{"area":"283","country":"1"},{"area":"284","country":"1"},{"area":"945","country":"1"},{"area":"301","country":"1"},{"area":"302","country":"1"},{"area":"303","country":"1"},{"area":"304","country":"1"},{"area":"305","country":"1"},{"area":"307","country":"1"},{"area":"308","country":"1"},{"area":"309","country":"1"},{"area":"310","country":"1"},{"area":"311","country":"1"},{"area":"312","country":"1"},{"area":"313","country":"1"},{"area":"314","country":"1"},{"area":"315","country":"1"},{"area":"316","country":"1"},{"area":"317","country":"1"},{"area":"318","country":"1"},{"area":"319","country":"1"},{"area":"320","country":"1"},{"area":"321","country":"1"},{"area":"323","country":"1"},{"area":"325","country":"1"},{"area":"330","country":"1"},{"area":"331","country":"1"},{"area":"332","country":"1"},{"area":"334","country":"1"},{"area":"336","country":"1"},{"area":"337","country":"1"},{"area":"339","country":"1"},{"area":"340","country":"1"},{"area":"341","country":"1"},{"area":"345","country":"1"},{"area":"346","country":"1"},{"area":"347","country":"1"},{"area":"351","country":"1"},{"area":"352","country":"1"},{"area":"360","country":"1"},{"area":"361","country":"1"},{"area":"369","country":"1"},{"area":"380","country":"1"},{"area":"385","country":"1"},{"area":"386","country":"1"},{"area":"401","country":"1"},{"area":"402","country":"1"},{"area":"404","country":"1"},{"area":"405","country":"1"},{"area":"406","country":"1"},{"area":"407","country":"1"},{"area":"408","country":"1"},{"area":"409","country":"1"},{"area":"410","country":"1"},{"area":"411","country":"1"},{"area":"412","country":"1"},{"area":"413","country":"1"},{"area":"414","country":"1"},{"area":"415","country":"1"},{"area":"417","country":"1"},{"area":"419","country":"1"},{"area":"423","country":"1"},{"area":"424","country":"1"},{"area":"425","country":"1"},{"area":"430","country":"1"},{"area":"432","country":"1"},{"area":"434","country":"1"},{"area":"435","country":"1"},{"area":"438","country":"1"},{"area":"440","country":"1"},{"area":"441","country":"1"},{"area":"442","country":"1"},{"area":"443","country":"1"},{"area":"456","country":"1"},{"area":"458","country":"1"},{"area":"464","country":"1"},{"area":"469","country":"1"},{"area":"470","country":"1"},{"area":"473","country":"1"},{"area":"475","country":"1"},{"area":"478","country":"1"},{"area":"479","country":"1"},{"area":"480","country":"1"},{"area":"484","country":"1"},{"area":"500","country":"1"},{"area":"501","country":"1"},{"area":"502","country":"1"},{"area":"503","country":"1"},{"area":"504","country":"1"},{"area":"505","country":"1"},{"area":"507","country":"1"},{"area":"508","country":"1"},{"area":"509","country":"1"},{"area":"510","country":"1"},{"area":"511","country":"1"},{"area":"512","country":"1"},{"area":"513","country":"1"},{"area":"515","country":"1"},{"area":"516","country":"1"},{"area":"517","country":"1"},{"area":"518","country":"1"},{"area":"520","country":"1"},{"area":"530","country":"1"},{"area":"539","country":"1"},{"area":"540","country":"1"},{"area":"541","country":"1"},{"area":"551","country":"1"},{"area":"555","country":"1"},{"area":"557","country":"1"},{"area":"559","country":"1"},{"area":"561","country":"1"},{"area":"562","country":"1"},{"area":"563","country":"1"},{"area":"564","country":"1"},{"area":"567","country":"1"},{"area":"570","country":"1"},{"area":"571","country":"1"},{"area":"573","country":"1"},{"area":"574","country":"1"},{"area":"575","country":"1"},{"area":"580","country":"1"},{"area":"585","country":"1"},{"area":"586","country":"1"},{"area":"600","country":"1"},{"area":"601","country":"1"},{"area":"602","country":"1"},{"area":"603","country":"1"},{"area":"605","country":"1"},{"area":"606","country":"1"},{"area":"607","country":"1"},{"area":"608","country":"1"},{"area":"609","country":"1"},{"area":"610","country":"1"},{"area":"611","country":"1"},{"area":"612","country":"1"},{"area":"614","country":"1"},{"area":"615","country":"1"},{"area":"616","country":"1"},{"area":"617","country":"1"},{"area":"618","country":"1"},{"area":"619","country":"1"},{"area":"620","country":"1"},{"area":"623","country":"1"},{"area":"626","country":"1"},{"area":"627","country":"1"},{"area":"628","country":"1"},{"area":"629","country":"1"},{"area":"630","country":"1"},{"area":"631","country":"1"},{"area":"636","country":"1"},{"area":"641","country":"1"},{"area":"646","country":"1"},{"area":"649","country":"1"},{"area":"650","country":"1"},{"area":"651","country":"1"},{"area":"657","country":"1"},{"area":"660","country":"1"},{"area":"661","country":"1"},{"area":"662","country":"1"},{"area":"664","country":"1"},{"area":"667","country":"1"},{"area":"669","country":"1"},{"area":"670","country":"1"},{"area":"671","country":"1"},{"area":"678","country":"1"},{"area":"679","country":"1"},{"area":"681","country":"1"},{"area":"682","country":"1"},{"area":"684","country":"1"},{"area":"689","country":"1"},{"area":"700","country":"1"},{"area":"701","country":"1"},{"area":"702","country":"1"},{"area":"703","country":"1"},{"area":"704","country":"1"},{"area":"706","country":"1"},{"area":"707","country":"1"},{"area":"708","country":"1"},{"area":"710","country":"1"},{"area":"711","country":"1"},{"area":"712","country":"1"},{"area":"713","country":"1"},{"area":"714","country":"1"},{"area":"715","country":"1"},{"area":"716","country":"1"},{"area":"717","country":"1"},{"area":"718","country":"1"},{"area":"719","country":"1"},{"area":"720","country":"1"},{"area":"721","country":"1"},{"area":"724","country":"1"},{"area":"725","country":"1"},{"area":"727","country":"1"},{"area":"731","country":"1"},{"area":"732","country":"1"},{"area":"734","country":"1"},{"area":"737","country":"1"},{"area":"740","country":"1"},{"area":"743","country":"1"},{"area":"747","country":"1"},{"area":"754","country":"1"},{"area":"757","country":"1"},{"area":"758","country":"1"},{"area":"760","country":"1"},{"area":"762","country":"1"},{"area":"763","country":"1"},{"area":"764","country":"1"},{"area":"765","country":"1"},{"area":"767","country":"1"},{"area":"769","country":"1"},{"area":"770","country":"1"},{"area":"772","country":"1"},{"area":"773","country":"1"},{"area":"774","country":"1"},{"area":"775","country":"1"},{"area":"779","country":"1"},{"area":"781","country":"1"},{"area":"784","country":"1"},{"area":"785","country":"1"},{"area":"786","country":"1"},{"area":"787","country":"1"},{"area":"800","country":"1"},{"area":"801","country":"1"},{"area":"802","country":"1"},{"area":"803","country":"1"},{"area":"804","country":"1"},{"area":"805","country":"1"},{"area":"806","country":"1"},{"area":"808","country":"1"},{"area":"809","country":"1"},{"area":"810","country":"1"},{"area":"811","country":"1"},{"area":"812","country":"1"},{"area":"813","country":"1"},{"area":"814","country":"1"},{"area":"815","country":"1"},{"area":"816","country":"1"},{"area":"817","country":"1"},{"area":"818","country":"1"},{"area":"822","country":"1"},{"area":"828","country":"1"},{"area":"829","country":"1"},{"area":"830","country":"1"},{"area":"831","country":"1"},{"area":"832","country":"1"},{"area":"833","country":"1"},{"area":"835","country":"1"},{"area":"843","country":"1"},{"area":"844","country":"1"},{"area":"845","country":"1"},{"area":"847","country":"1"},{"area":"848","country":"1"},{"area":"849","country":"1"},{"area":"850","country":"1"},{"area":"855","country":"1"},{"area":"856","country":"1"},{"area":"857","country":"1"},{"area":"858","country":"1"},{"area":"859","country":"1"},{"area":"860","country":"1"},{"area":"862","country":"1"},{"area":"863","country":"1"},{"area":"864","country":"1"},{"area":"865","country":"1"},{"area":"866","country":"1"},{"area":"868","country":"1"},{"area":"869","country":"1"},{"area":"870","country":"1"},{"area":"872","country":"1"},{"area":"876","country":"1"},{"area":"877","country":"1"},{"area":"878","country":"1"},{"area":"880","country":"1"},{"area":"881","country":"1"},{"area":"882","country":"1"},{"area":"888","country":"1"},{"area":"898","country":"1"},{"area":"900","country":"1"},{"area":"901","country":"1"},{"area":"903","country":"1"},{"area":"904","country":"1"},{"area":"906","country":"1"},{"area":"907","country":"1"},{"area":"908","country":"1"},{"area":"909","country":"1"},{"area":"910","country":"1"},{"area":"911","country":"1"},{"area":"912","country":"1"},{"area":"913","country":"1"},{"area":"914","country":"1"},{"area":"915","country":"1"},{"area":"916","country":"1"},{"area":"917","country":"1"},{"area":"918","country":"1"},{"area":"919","country":"1"},{"area":"920","country":"1"},{"area":"925","country":"1"},{"area":"927","country":"1"},{"area":"928","country":"1"},{"area":"929","country":"1"},{"area":"931","country":"1"},{"area":"935","country":"1"},{"area":"936","country":"1"},{"area":"937","country":"1"},{"area":"939","country":"1"},{"area":"940","country":"1"},{"area":"941","country":"1"},{"area":"947","country":"1"},{"area":"949","country":"1"},{"area":"951","country":"1"},{"area":"952","country":"1"},{"area":"954","country":"1"},{"area":"956","country":"1"},{"area":"957","country":"1"},{"area":"959","country":"1"},{"area":"970","country":"1"},{"area":"971","country":"1"},{"area":"972","country":"1"},{"area":"973","country":"1"},{"area":"975","country":"1"},{"area":"976","country":"1"},{"area":"978","country":"1"},{"area":"979","country":"1"},{"area":"980","country":"1"},{"area":"984","country":"1"},{"area":"985","country":"1"},{"area":"989","country":"1"},{"area":"999","country":"1"},{"area":"204","country":"2"},{"area":"226","country":"2"},{"area":"236","country":"2"},{"area":"249","country":"2"},{"area":"250","country":"2"},{"area":"263","country":"2"},{"area":"289","country":"2"},{"area":"306","country":"2"},{"area":"343","country":"2"},{"area":"354","country":"2"},{"area":"365","country":"2"},{"area":"367","country":"2"},{"area":"368","country":"2"},{"area":"403","country":"2"},{"area":"416","country":"2"},{"area":"418","country":"2"},{"area":"431","country":"2"},{"area":"437","country":"2"},{"area":"450","country":"2"},{"area":"468","country":"2"},{"area":"474","country":"2"},{"area":"506","country":"2"},{"area":"514","country":"2"},{"area":"519","country":"2"},{"area":"548","country":"2"},{"area":"579","country":"2"},{"area":"581","country":"2"},{"area":"584","country":"2"},{"area":"587","country":"2"},{"area":"604","country":"2"},{"area":"613","country":"2"},{"area":"639","country":"2"},{"area":"647","country":"2"},{"area":"672","country":"2"},{"area":"683","country":"2"},{"area":"705","country":"2"},{"area":"709","country":"2"},{"area":"742","country":"2"},{"area":"753","country":"2"},{"area":"778","country":"2"},{"area":"780","country":"2"},{"area":"782","country":"2"},{"area":"807","country":"2"},{"area":"819","country":"2"},{"area":"825","country":"2"},{"area":"867","country":"2"},{"area":"873","country":"2"},{"area":"902","country":"2"},{"area":"905","country":"2"},{"area":"481","country":"2"}];

  processOtp:boolean=false;
  showForgotPass:boolean=false;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  sendAgainMsg:boolean=false;
  invalidOtpError:boolean=false;
  form: FormGroup;
   invalidOtp:any='' 
   error_response:any='' 
   err_forgot_pass:any='' 
 
   @ViewChildren('formRow') rows: any;
   enteredPhone:number;
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
    this.form           = this.toFormGroup(this.formInput);
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
     // this.reward_content = true;
      this.reward_content   = localStorage.getItem('redirect_path') == 'account/rewards'?true:false;
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

    let phoneToRegister: any = this.signUpForm.value.phoneOrEmail;
    //const country: Country = this.signUpForm.value.country;
    const country: Country = this.currentSetting.country;
    let country_code:any = country.CountryCode;
    this.enteredPhone = phoneToRegister;
    if (!phoneToRegister.startsWith(`+1`))
    {
      const firstThreeDigits: string = phoneToRegister.toString().slice(0, 3);
      const areaMatches = this.areaCodes.filter(code => code.area === firstThreeDigits);
      if (areaMatches[0]) { 
        const cntry = this.countryFrom.filter(item=>item.CountryId == areaMatches[0].country);
        const country1: Country = cntry[0]
        this.currentSetting.country = country1;
        this.razaEnvService.setCurrentSetting(this.currentSetting);

      } 

    }

    if (phoneToRegister.startsWith(`${country.CountryCode}`))
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
       
    this.authService.sendOtpForRegister(phoneNumber, token).toPromise()
      .then(res => {
         //this.openOtpConfirmDialog(phoneNumber);
        // this.dialog.open(OtpDialogComponent);
         //this.showPinBox = true;
         
         this.processOtp = true;
      });
    })
  }

  resendOtp() {
    this.invalidOtpError = false;
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
          this.closeModal();
          this.registerAndLoginUser(phoneNumber, otpVal);
        } else
         {
            this.invalidOtpError = true;
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
          var phoneno 		= /^\d{10}$/;
          let phoneOrEmail 	= tempEmail;
						if(phoneOrEmail.match(phoneno) )
              {
                phoneOrEmail = this.currentSetting.country.CountryCode+tempEmail
              }
          const loginBody = {
            username: phoneOrEmail,
            password: otp,
            phone:tempEmail
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

  changeNumber()
  {
    this.processOtp = false;
    this.showForgotPass = true;
    this.invalidOtp = ''; 
    this.error_response='';
    this.err_forgot_pass = '';
  }

  formattedNumber(obj)
  {
    const phoneNumber = obj;
    const formattedNumber = phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    return formattedNumber; // Output: 312 975 8545
 
  }
  sendOtpAgain()
  {
    this.onSignupFormSubmit();
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
     
    this.invalidOtpError = false;
   
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


  keyPressEvent(event, index) {
    

  }

  resendCode()
  {
    this.invalidOtp = '';
    this.form.reset();
     
  }
 

  onSubmit(): void {
    
    let otp = this.form.value.input1+this.form.value.input2+this.form.value.input3+this.form.value.input4+this.form.value.input5+this.form.value.input6;
   
    this.signUpForm.controls['otp'].setValue(otp);
    this. onOtpConfirmFormSubmit ();

  }

  processClose()
  {
    this.processOtp = false;
  }
}
