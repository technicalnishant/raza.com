import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-global-call-india',
  templateUrl: './global-call-india.component.html',
  styleUrls: ['./global-call-india.component.scss']
})
export class GlobalCallIndiaComponent implements OnInit, OnDestroy {

  countryCode: number;
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
    public dialogRef: MatDialogRef<GlobalCallIndiaComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService
  ) {


    //   console.log(inputData.data);

  }

  ngOnInit() {
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
    this.router.navigateByUrl("/learnmore");
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

  buyPlan() {
    const deno: Denominations = this.Plans.find(a => a.Price == this.denominationSelectControl.value);
    this.onClickRateTab(deno);
  }

  scrollToTop() {
    this.matContent.nativeElement.scrollTop = 0;
  }
}
