import { Component, OnInit, Injector } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { PurchasePlanReqModel } from '../../models/purchase-plan-req.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CountriesService } from '../../../core/services/country.service';
import { Country } from '../../../core/models/country.model';
//import { isNullOrUndefined } from 'util';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { OtpConfirmationComponent } from '../../../shared/dialog/otp-confirmation/otp-confirmation.component';
import { RegisterCustomerModel } from '../../../core/models/register-customer.model';
import { Observable } from 'rxjs';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { AppBaseComponent } from '../../../shared/components/app-base-component';
import { isNullOrUndefined } from "../../../shared/utilities";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AppBaseComponent implements OnInit {

  purchasePlanReq: PurchasePlanReqModel;
  purchaseInfoForm: FormGroup;
  countries: Country[];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private titleService: Title,
    private countryService: CountriesService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    _injector: Injector
  ) {
    super(_injector)
  }

  ngOnInit() {
    this.getPurchasedPlan();
    this.getFromCountries();

    this.purchaseInfoForm = this.formBuilder.group({
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
    });
  }

  getFromCountries() {
    this.countryService.getFromCountries().subscribe(
      (res: Country[]) => {
        this.countries = res.slice(0, 3);
      })
  }

  /* Get Purchased Plan. */
  getPurchasedPlan() {
    PurchaseService.purchasePlan.subscribe(
      res => {
        this.purchasePlanReq = res;
      },
      err => { },
      () => {
        if (isNullOrUndefined(this.purchasePlanReq)) {
          this.router.navigate(['/']);
        }
      })
  }

  onPurchaseInfoFormSubmit() {
    //console.log(this.purchaseInfoForm.value);
    if (!this.purchaseInfoForm.valid) {
      return;
    }

    this.purchasePlanReq.country = this.purchaseInfoForm.value.country;
    this.purchasePlanReq.phoneNumber = this.purchaseInfoForm.value.phoneNumber;

    this.isEmailOrPhoneExist(this.purchasePlanReq.phoneNumber).toPromise()
      .then(res => {
        this.sendOtp();
      }).catch((err: ApiErrorResponse) => {
        this.purchaseInfoForm.controls['phoneNumber'].setErrors({ 'already_exist': true });
      });


  }

  private sendOtp() {
    this.executeCaptcha('login').toPromise().then(token => {
    this.authService.sendOtp(this.purchaseInfoForm.value.phoneNumber, token).toPromise()
      .then(res => {
        this.openOtpConfirmDialog(this.purchaseInfoForm.value.phoneNumber);
      })
      })
  }

  private isEmailOrPhoneExist(emailOrPhone: string): Observable<boolean | ApiErrorResponse> {
    return this.executeCaptcha('IsExist').pipe(switchMap(token =>
      this.authService.isEmailOrPhoneExist(1, emailOrPhone, token)
    ));
  }

  openOtpConfirmDialog(phoneNumber: string) {
    const dialogOtpConfirm = this.dialog.open(OtpConfirmationComponent,
      {
        data: {
          phoneNumber: phoneNumber,
        }
      });

    dialogOtpConfirm.afterClosed().subscribe(otp => {
      // console.log("Otp dailog closed with result", otp);
      if (!isNullOrUndefined(otp)) {
        this.registerAndLoginUser(phoneNumber, otp);
      }
    },
      err => { },
    )
  }

  registerAndLoginUser(phoneNumber: string, otp: string) {
    //user Register and logIn.  navigate to payment Info.
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
      country: this.purchaseInfoForm.value.country.CountryId,
      aboutUs: '',
      refererEmail: '',
      callingCountryId: this.purchasePlanReq.countryTo,
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
            this.redirectToPaymentInfo();
          })
        }
      }
    )
  }

  redirectToPaymentInfo() {
    this.router.navigate(['purchase/payment-info']);
  }

  calculateServiceFee(): number {
    return this.purchasePlanReq.details.ServiceCharge * this.purchasePlanReq.details.Price / 100;
  }

  totalAmount(): number {
  
    return this.calculateServiceFee() + this.purchasePlanReq.details.Price;
  }

}
