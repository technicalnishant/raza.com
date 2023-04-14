import { Component, OnInit, Inject, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FormControl } from '@angular/forms';
import { CurrencyCode } from '../../../core/interfaces/CurrencyCode';
import { AuthenticationService } from '../../../core/services/auth.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { CallUsComponent } from '../../dialog/call-us/call-us.component';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { Promotion } from '../../../deals/model/Promotion';
import { PromotionPlanDenomination } from '../../../deals/model/promotion-plan-denomination';

@Component({
  selector: 'app-deal-popup-view',
  templateUrl: './deal-popup-view.component.html',
  styleUrls: ['./deal-popup-view.component.scss']
})
export class DealPopupViewComponent implements OnInit, OnDestroy {

  countryCode: number;
  countryName: string;
  countryId: number;
  currencyCode: CurrencyCode;
  RatePerMin: number;
  RatePerMinPromo: number;
  RatePerMinWithOutPromo: number;
  isAutorefill = true;
  viewAllrate = false;
  viewAllPlan = false;
  promotionCode :string='';
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;

  denominationList: any[];
  denominationSelectControl: FormControl = new FormControl();
  @ViewChild('matContent',{static: true}) matContent: ElementRef;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<DealPopupViewComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData: Promotion,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService
  ) {


  }

  ngOnInit() {
     console.log(this.inputData);
    this.promotionCode = this.inputData.PromotionCode;
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });
    localStorage.removeItem("promotionCode");
    localStorage.removeItem("promotionCode");
  }

  
  get Denominations() {
   
    return this.inputData.Plans[0].Denominations;
    
  }

  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  contactUs() {
    this.dialog.open(CallUsComponent);
  }

  closeIcon(): void {
    this.dialogRef.close();
  }

  learnmore() {
    this.dialogRef.close();
    localStorage.setItem('countryId', this.countryId.toString());
    this.router.navigateByUrl("/learnmore");
  }

  onChange(values) {

  }

  buyPlan(denomination: PromotionPlanDenomination) {

    localStorage.setItem('promotionCode', this.promotionCode);

    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();
    this.closeIcon();
    model.CardId = this.inputData.Plans[0].CardId;
    model.CardName = this.inputData.Plans[0].CardName;
    model.CurrencyCode = denomination.CurrencyCode;
    model.details = {
      Price: denomination.Price,
      ServiceCharge: this.inputData.Plans[0].ServiceCharge ? this.inputData.Plans[0].ServiceCharge : 0,
      SubCardId: denomination.SubCardId
    }
    model.isPromotion = true;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = denomination.CountryToId;
    model.couponCode = this.promotionCode;
    model.currencyCode = denomination.CurrencyCode;
    model.transactiontype = TransactionType.Activation;
    model.couponCode = this.inputData.Plans[0].CouponCode;
    model.isCalculatedServiceFee = false;
    model.isAutoRefill = false;
    model.isMandatoryAutorefill = true;
    model.isHideCouponEdit = !this.inputData.Plans[0].IsEditCoupon;
    model.offerPercentage = denomination.OfferPercentage;
     
 
    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  scrollToTop() {
    this.matContent.nativeElement.scrollTop = 0;
  }
}
