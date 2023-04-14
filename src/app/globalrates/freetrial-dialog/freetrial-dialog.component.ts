import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef,ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalRatesService } from '../globalrates.service';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';
import { GlobalSubPlans } from '../model/globalSubPlans';
import { RefillPlans } from '../model/refillPlans';
import { Router } from '@angular/router';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { Denominations } from '../model/denominations';
import { GlobalPlansData } from '../model/globalPlansData';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { of, Subscription } from 'rxjs';
import { CheckoutService } from '../../checkout/services/checkout.service';
import { NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { AuthenticationService } from '../../core/services/auth.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { CurrencyCode } from '../../core/interfaces/CurrencyCode';
import { FormControl } from '@angular/forms';
import { FreeTrial } from '../../shared/model/freetrial';
 

@Component({
  selector: 'app-freetrial-dialog',
  templateUrl: './freetrial-dialog.component.html',
  styleUrls: ['./freetrial-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FreetrialDialogComponent implements OnInit, OnDestroy{
countryCode: number;
freeTrial: FreeTrial[];
  countryName: string;
  countryId: number;
  currencyCode: CurrencyCode;
  RatePerMin: number;
  RatePerMinPromo: number;
  RatePerMinWithOutPromo: number;
  SubPlans: GlobalSubPlans[] = [];
  FilteredSubPlans: GlobalSubPlans[] = [];
  Plans: Denominations[];
  AutorefillPlans: Denominations[];
  WithoutAutorefillPlans: Denominations[];
  isAutorefill = true;
  viewAllrate = false;
  viewAllPlan = false;
  freeMinutes:number;
  couponCode : string;
   
  countryFrom :any;
  cardName :any;
  cardId :any;

  globalPlanData: GlobalPlansData;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;

  denominationList: any[];
  denominationSelectControl: FormControl = new FormControl();
  @ViewChild('matContent',{static: true}) matContent: ElementRef;
  constructor(
	private searchRatesService: GlobalRatesService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<FreetrialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService
	) 
	{
	 
      this.countryId 		= inputData.country.CountryTo;
      this.countryName 		= inputData.country.CountryName;
      this.freeMinutes 		= inputData.country.FreeMinutes;
      this.couponCode 		= inputData.country.CouponCode;
      this.countryFrom 		= inputData.country.CountryFrom;
      this.cardName 		= inputData.country.CardName;
      this.cardId 			= inputData.country.CardId;
     
    this.globalPlanData = inputData.country;
	}

  ngOnInit(): void {
  console.log(this.globalPlanData)
  this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });
	 
	 
  }


  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  contactUs() {
    this.dialog.open(CallUsComponent);
  }

  onChange(event) {
    if (event.checked == true) {
      this.Plans = this.AutorefillPlans;
      this.isAutorefill = true;
      this.RatePerMin = this.RatePerMinPromo;
    }
    else {
      this.Plans = this.WithoutAutorefillPlans;
      this.isAutorefill = false;
      this.RatePerMin = this.RatePerMinWithOutPromo;
    }
  }

  selectAmount(arg) {

  }

  selectDenomination() {
    this.filterDetailRate(this.denominationSelectControl.value);
  }


  filterDetailRate(price: number) {
    this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price);
  }


  closeIcon(): void {
    this.dialogRef.close();
  }

  learnmore() {
    this.dialogRef.close();
    localStorage.setItem('countryId', this.countryId.toString());
    this.router.navigateByUrl(`/learnmore?country=${this.countryId}`);
  }

  viewAllRatesTab() {
    this.searchRatesService.getSearchGlobalRatesSubPlans(this.currentSetting.currentCountryId, this.countryId).subscribe(
      (data: any) => {
        this.SubPlans = data
        if (this.SubPlans.length > 0) {
          this.denominationList = Array.from(new Set(this.SubPlans.map(item => item.Price)));
          this.denominationSelectControl.setValue(this.denominationList[0]);
          this.filterDetailRate(this.denominationList[0]);
          this.viewAllrate = true;
          this.matContent.nativeElement.scrollTop = 500;
        }
        else
          this.viewAllPlan = false;
      }
      , (err: ApiErrorResponse) => console.log(err));
  }


  //GlobalPlansData
  onClickRateTab(item: Denominations) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.globalPlanData.CardId;
    model.CardName = this.globalPlanData.CardName;
    model.CurrencyCode = this.globalPlanData.CurrencyCode;
    model.details = item;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryId;
    model.couponCode = '';
    model.currencyCode = this.globalPlanData.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    //     model.phoneNumber = ''; 
    model.transactiontype = this.authService.isNewUser() ? TransactionType.Activation : TransactionType.Sale;
    model.isAutoRefill = this.isAutorefill;
    this.checkoutService.setCurrentCart(model);
    of(this.closeIcon()).toPromise().then(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/checkout/payment-info']);
      } else {
        this.router.navigate(['/checkout']);
      }
	 
    })
  }

	tryUsFree() {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.cardId;
    model.CardName = this.cardName;
    model.CurrencyCode = this.currencyCode;
    model.details = {
      Price: 0,
      ServiceCharge: 0,
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryId;
     
    model.currencyCode = this.currentSetting.currency;
    model.transactiontype = TransactionType.Activation;
    model.isAutoRefill = false;
    model.couponCode = this.couponCode;
    model.isHideCouponEdit = true;
    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
	
	 this.dialogRef.close();
  }
  
  buyPlan() {
    const deno: Denominations = this.Plans.find(a => a.Price == this.denominationSelectControl.value);
    this.onClickRateTab(deno);
  }

  scrollToTop() {
    this.matContent.nativeElement.scrollTop = 0;
  }
}
