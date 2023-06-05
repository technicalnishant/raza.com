import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
//import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Country } from '../../../core/models/country.model';
import { CountriesService } from '../../../core/services/country.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { OtpConfirmationComponent } from '../../../shared/dialog/otp-confirmation/otp-confirmation.component';
import { RegisterCustomerModel } from '../../../core/models/register-customer.model';
import { CheckoutService } from '../../services/checkout.service';
import { ICheckoutModel, NewPlanCheckoutModel } from '../../models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { PasswordBoxComponent } from '../../../shared/dialog/password-box/password-box.component';
import { AppBaseComponent } from '../../../shared/components/app-base-component';
import { isNullOrUndefined } from "../../../shared/utilities";
import { switchMap } from 'rxjs/operators';
 
import { CurrentSetting } from '../../../core/models/current-setting';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { RazaSnackBarService } from 'app/shared/razaSnackbar.service';
@Component({
  selector: 'app-register',
  templateUrl: './checkout-register.component.html',
  styleUrls: ['./checkout-register.component.scss']
})
export class CheckoutRegisterComponent extends AppBaseComponent implements OnInit, OnDestroy {

  currentCart: ICheckoutModel
  purchaseInfoForm: FormGroup;
  countries: Country[];
  currentCountry: Country;
  submitButtonText = 'Verify';
  countryFlagCss: string;
  phoneAlreadyExistError = false;
  showDropdown: boolean = false;
  private currentCart$: Subscription;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  currentCurrency:any;
  allCountry: any[];
  countryFrom: Country[];
  isPromotion:boolean = false;
  promoCode:string=''; 
  hidePrefix:boolean=true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title,
    private countryService: CountriesService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private checkoutService: CheckoutService,
    private razaLayoutService: RazaLayoutService,
    private razaEnvService: RazaEnvironmentService,
    private razaSnackBarService: RazaSnackBarService,
    _injector: Injector
  ) {
    super(_injector)
  }

  ngOnInit() {
    this.titleService.setTitle('Register your account');
    this.razaLayoutService.setFixedHeader(true);

    if (this.authService.isAuthenticated()) {
      this.redirectToPaymentInfo();
    }

    this.purchaseInfoForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]],
      password: ['']
    });

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
    //get current cart.
    this.getCurrentCart();
    this.getFromCountries();
    this.gotoTop();
    this.getCountryFrom();
    const cart: NewPlanCheckoutModel = this.currentCart as NewPlanCheckoutModel;
    this.isPromotion = cart.isPromotion;
    this.promoCode = cart.couponCode;
    if(localStorage.getItem('promotionCode') != this.promoCode)
    this.promoCode = '';

     
    //console.log("Hello");
   // console.log(localStorage.getItem('promotionCode'));

  }

  private getCountryFrom() {
    this.countryService.getFromCountries().subscribe((res: Country[]) => {
      this.countryFrom = res;
    });
  }

  gotoTop() {
    setTimeout (() => {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }, 1000);
  }
  ngOnDestroy(): void {
    this.currentCart$.unsubscribe();
  }
 
  getFromCountries() {
    this.countryService.getFromCountries().subscribe(
      (res: Country[]) => {

        const cart: NewPlanCheckoutModel = this.currentCart as NewPlanCheckoutModel;
        this.currentCountry = res.find(a => a.CountryId === cart.countryFrom);
        this.countryFlagCss = `flag flag-f-${this.currentCountry.CountryId}`

      });
  }

  /* Get Purchased Plan. */
  getCurrentCart() {
    this.currentCart$ = this.checkoutService.getCurrentCart().subscribe(
      (res: ICheckoutModel) => {
        this.currentCart = res;
      },
      err => { },
      () => {
        if (isNullOrUndefined(this.currentCart)) {
          this.router.navigate(['/']);
        }
      })
  }

  validateUsername()
  {
    var reciever = this.purchaseInfoForm.value.phoneNumber;
    var phoneno = /^\d{10}$/;
    if(reciever !='')
    {
       if(  reciever.match(phoneno) )
      {
        this.hidePrefix = true;
      }
      else{
        this.hidePrefix = false;
      }
    }
  }
  onPurchaseInfoFormSubmit() {
    this.phoneAlreadyExistError = false;
    if (!this.purchaseInfoForm.valid) {
      return;
    }

    this.isEmailOrPhoneExist(this.currentCountry.CountryCode, this.purchaseInfoForm.value.phoneNumber).toPromise()
      .then(res => {
        this.sendOtp();
        localStorage.setItem("login_no", this.purchaseInfoForm.value.phoneNumber);
      }).catch((err: ApiErrorResponse) => {
        this.openPasswordLoginDialog(this.purchaseInfoForm.value.phoneNumber)
      });
  }

  private openPasswordLoginDialog(phoneNumber: string) {
    /*var phoneno = /^\d{10}$/;
    var reciever = phoneNumber;
    if( reciever.match(phoneno) )
    {}redirectToPaymentInfo
      
    */
   localStorage.setItem("login_no", phoneNumber);
    const dialogPassword = this.dialog.open(PasswordBoxComponent,
      {
        data: {
          phoneNumber: `${this.currentCountry.CountryCode}${phoneNumber}`,
        }
      });

    dialogPassword.afterClosed().subscribe(res => {
      console.log("Your response after login is  data is ", res);
      if (res.countryId ) {
        let country = this.countryFrom.filter(a=>a.CountryId == res.countryId);
        console.log("Your filter data is ", country[0]);
        this.currentSetting.country = country[0]
            this.setcurrentCurrency(this.currentSetting.country.CountryId);
         
      }
    },
      err => { },
    )
  }


  private sendOtp() {
    const phoneWithCountryCode = `${this.currentCountry.CountryCode}${this.purchaseInfoForm.value.phoneNumber}`
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtpForRegister(phoneWithCountryCode, token).toPromise()
      .then(res => {
        this.openOtpConfirmDialog(this.purchaseInfoForm.value.phoneNumber);
      })
    })
  }

  private isEmailOrPhoneExist(countryCode: string, emailOrPhone: string): Observable<boolean | ApiErrorResponse> {
     
    return this.executeCaptcha('IsExist').pipe(switchMap(token =>
      this.authService.isEmailOrPhoneExist(countryCode, emailOrPhone, token)
    ));
     
  }

  private openOtpConfirmDialog(phoneNumber: string) {
   /* var phoneno = /^\d{10}$/;
    var reciever = phoneNumber;
    if( reciever.match(phoneno) )
    {}*/
      
    localStorage.setItem("login_no", phoneNumber);

    const dialogOtpConfirm = this.dialog.open(OtpConfirmationComponent,
      {
        data: {
          phoneNumber: `${this.currentCountry.CountryCode}${phoneNumber}`,
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

  private registerAndLoginUser(phoneNumber: string, otp: string) {
    //user Register and logIn.  navigate to payment Info.
    let callingToCountryId: number = 341;
    if (this.currentCart.transactiontype === TransactionType.Sale || this.currentCart.transactiontype === TransactionType.Activation) {
      const cart = this.currentCart as NewPlanCheckoutModel;
      callingToCountryId = cart.countryTo;
    }
    const tempEmail = `${phoneNumber}@raza.temp`;
    let promo_code = localStorage.getItem('promo_code');
    const registerModel: RegisterCustomerModel = {
      emailAddress: tempEmail,
      password: otp,
      firstName: '',
      lastName: '',
      primaryPhone: phoneNumber,
      alternatePhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: this.currentCountry.CountryId,
      aboutUs: '',
      refererEmail: '',
      callingCountryId: callingToCountryId,
      isQuickSignUp: true,
      PromoCode:(typeof promo_code !== 'undefined')?promo_code:''
    }

    this.authService.register(registerModel).toPromise().then(
      (res: boolean) => {
        if (res) {
          const loginBody = {
            username: tempEmail,
            password: otp
          }
          this.authService.login(loginBody).toPromise().then(user => {
           // console.log("user info after login ",user);
             this.redirectToPaymentInfo();
          })
        }
      }
    )
    .catch((err: ApiErrorResponse) => {
      console.log(err.error)
      this.razaSnackBarService.openError(err.error.Message)
    });
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
 
    this.closeFlagDropDown();
    this.setcurrentCurrency(this.currentSetting.country.CountryId);
  }

  redirectToPaymentInfo() {
    this.authService.getCurrentUserCountry().subscribe(countryId => {
      // console.log("user info after login ",user);
      let country = this.countryFrom.filter(a=>a.CountryId == countryId);
      this.currentSetting.country = country[0]
         this.setcurrentCurrency(countryId);
     })
    
   // 
  }

  setcurrentCurrency(obj)
  {
    if(obj == 1)
      this.currentCurrency='USD';
      if(obj == 2)
      this.currentCurrency='CAD';
      if(obj == 3)
      this.currentCurrency='GBP';
      if(obj == 8)
      this.currentCurrency='AUD';
      if(obj == 20)
      this.currentCurrency='NZD';
      if(obj == 26)
      this.currentCurrency='INR';
     
      console.log("currenct cart info is ", this.currentCart );
      //currencyCode = this.currentCurrency
     // countryFrom = obj;
      const cart: NewPlanCheckoutModel = this.currentCart as NewPlanCheckoutModel;
      cart.CurrencyCode = this.currentCurrency;
      cart.currencyCode = this.currentCurrency;
      cart.countryFrom  = obj;
      console.log("current cart currency", cart.currencyCode );
      console.log("current cart from", cart.countryFrom );
      //var cart_info = this.checkoutService.getCurrentCart().
      // if(obj == 1)
      // {
      //   cart.details.ServiceCharge = 0
      // }
      // if(obj == 2)
      // {
      //   cart.details.ServiceCharge = 10
      // }
      

      
      this.checkoutService.setCurrentCart(cart);
      console.log(cart);
      this.router.navigate(['/checkout/payment-info']);
       
  }

}
