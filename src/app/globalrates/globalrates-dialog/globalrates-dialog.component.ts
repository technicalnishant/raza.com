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
import { Promotion } from '../../deals/model/Promotion';
import { PromotionPlanDenomination } from '../../deals/model/promotion-plan-denomination';
import { PromotionPlan } from '../../deals/model/promotion-plan';
import { FormControl } from '@angular/forms';
import { Country } from '../../core/models/country.model';
  
  
@Component({
  selector: 'app-globalrates-dialog',
  templateUrl: './globalrates-dialog.component.html',
  styleUrls: ['./globalrates-dialog.component.scss']
})
export class GlobalratesDialogComponent implements OnInit, OnDestroy {

countryCode: number;
  countryName: string;
  countryId: number;
   currency:any;
   CurrencyCode:any;
   transType:any; 
  countryToList: Country[];
  RatePerMin: number;
  RatePerMinPromo: number;
  RatePerMinWithOutPromo: number;
  SubPlans: GlobalSubPlans[] = [];
  FilteredSubPlans: GlobalSubPlans[] = [];
 
  AutorefillPlans: Denominations[];
  WithoutAutorefillPlans: Denominations[];
  

  promotion: Promotion;
  planDenominations: PromotionPlanDenomination[];

  isAutorefill = true;
  viewAllrate = false;
  viewAllPlan = false;
  countryIn =[];
  isDetailMode: boolean = false;
  globalPlanData: GlobalPlansData;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  cardId:number;
  cardName:any;
  serviceCharge:any;
  currentCountryId:number;
  couponCode:any;
  isEditCoupon:any;
  //plan:PromotionPlanDenomination[];
  countryTo:Country;
  denominationList: any[];
  denominationSelectControl: FormControl = new FormControl();
  @ViewChild('matContent',{static: true}) matContent: ElementRef;
  
  constructor(
    private searchRatesService: GlobalRatesService,
    public dialog: MatDialog,
    private router: Router,
    
	public dialogRef: MatDialogRef<GlobalratesDialogComponent>,
	
    @Inject(MAT_DIALOG_DATA) public inputData: any,
	
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService
  ) {
    
	this.RatePerMinPromo = inputData.list[2].RatePerMin;
	this.RatePerMin = this.RatePerMinPromo;
  this.currency = inputData.list[0].CurrencyCode;
 this.CurrencyCode = inputData.list[0].CurrencyCode;
  this.planDenominations = inputData.list;
	this.countryTo = inputData.country;
	this.countryCode = inputData.country.CountryCode;
  this.countryIn = inputData.flag_data;

  this.cardId = inputData.plan.CardId;
  this.cardName= inputData.plan.CardName;
  this.serviceCharge= inputData.plan.ServiceCharge;
  this.currentCountryId= inputData.flag_data.currentCountryId;
  this.couponCode= inputData.plan.CouponCode;
  this.isEditCoupon= inputData.plan.IsEditCoupon;

  this.currentSetting = inputData.courent_setting;
  this.transType = inputData.trans_type;
  //this.plan = inputData.plan;
    //console.log(inputData.list);
    //console.log(inputData.plan);
    console.log(this.planDenominations);
	
    

  }
  
  
  ngOnInit() {
    

    
  }

  ngOnDestroy(): void {
     
  }

  contactUs() {
    this.dialog.open(CallUsComponent);
  }

  onChange(event) {
    if (event.checked == true) {
      //this.Plans = this.AutorefillPlans;
     // this.isAutorefill = true;
     // this.RatePerMin = this.RatePerMinPromo;
    }
    else {
     // this.Plans = this.WithoutAutorefillPlans;
     // this.isAutorefill = false;
      //this.RatePerMin = this.RatePerMinWithOutPromo;
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
   // this.dialogRef.close();
   //localStorage.setItem('countryId', this.countryId.toString());
    //this.router.navigateByUrl(`/learnmore?country=${this.countryId}`);
  }

 
 
  
    toggleDetailMode() {
    //window.scrollTo({ top: 5 });
    this.isDetailMode = !this.isDetailMode;
  }
    getBackGroundMap() {
    const name = this.countryTo.CountryName.replace(' ', '').toLowerCase();
    return `assets/images/maps/${name}-d.png`;
  }
  
  buyDeal(item: PromotionPlanDenomination) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.cardId;
    model.CardName = this.cardName;
    model.CurrencyCode = item.CurrencyCode;
    model.details = {
      Price: item.Price,
      ServiceCharge: this.serviceCharge ? this.serviceCharge : 0,
      SubCardId: item.SubCardId
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryTo.CountryId;
    model.currencyCode = item.CurrencyCode
    model.transactiontype = this.transType;
    model.isAutoRefill = false;
    model.couponCode = this.couponCode;
    model.isHideCouponEdit = !this.isEditCoupon;
     //console.log(model); return false;
    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
      this.dialogRef.close();
    } else {
      this.router.navigate(['/checkout']);
      this.dialogRef.close();
    }
  }
  
}
