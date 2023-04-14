import { Component, OnInit } from '@angular/core';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Country } from '../../../core/models/country.model';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { DealsService } from '../../deals.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { Subscription, Observable } from 'rxjs';
import { NewPlanCheckoutModel } from '../../../checkout/models/checkout-model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Promotion } from '../../model/Promotion';
import { PromotionPlanDenomination } from '../../model/promotion-plan-denomination';
import { PromotionPlan } from '../../model/promotion-plan';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { GlobalratesDialogComponent } from '../../../globalrates/globalrates-dialog/globalrates-dialog.component'; 

@Component({
  selector: 'app-deal-view',
  templateUrl: './standard-promotion.component.html',
  styleUrls: ['./standard-promotion.component.css']
})
export class StandardPromotionComponent implements OnInit {
  autoControl = new FormControl();
  countryToList: Observable<Country[]>;
  allCountry: Observable<Country[]>;
   
  selectedValue: string;
  promotionCode: string;
  countryTo: Country;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  isDetailMode: boolean = false;
  isSmallScreen;
  promotion: Promotion;
  planDenominations: PromotionPlanDenomination[];
  
    showPlaceholder: boolean = true;
  showDropdown: boolean = false;
  searchicon: any;
  countryFrom: Country[];
  constructor(private router: Router,
    private route: ActivatedRoute,
    private dealsService: DealsService,
    private razaEnvService: RazaEnvironmentService,
    private authService: AuthenticationService,
    private checkoutService: CheckoutService,
	private razalayoutService: RazaLayoutService,
	private breakpointObserver: BreakpointObserver,
	 public dialog: MatDialog
	) {

  }

  ngOnInit() {
    //this.razalayoutService.setFixedHeader(true);
    //this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
	
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });

    this.dealsService.getCountryTo(this.promotion.PromotionCode, this.currentSetting.currentCountryId).subscribe(
      (data: Country[]) => {
       this.countryToList = data;
	   this.allCountry = data;
	   console.log(data);
      },
      (err: ApiErrorResponse) => console.log(err),
    );

 

    this.countryToList = this.autoControl.valueChanges
      .pipe(
        startWith<string | Country>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );
  }

  get plan(): PromotionPlan {
    return this.promotion.Plans[0]
  }

  toggleDetailMode() {
    window.scrollTo({ top: 5 });
    this.isDetailMode = !this.isDetailMode;
  }

  displayFn(country?: Country): string | undefined {
    return country ? country.CountryName : undefined;
  }

  private _filter(value: any): Country[] {
    const filterValue = value.toLowerCase();
    return this.countryToList.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  get LandingPageBanner() {
    // return `url(assets/images/promotions/newyear/${this.promotion.LandingPageImage}) no-repeat center 100%`;
    return `url('assets/images/existingcustomers-d.jpg') no-repeat cover`;
  }

  getBackGroundMap() {
    const name = this.countryTo.CountryName.replace(' ', '').toLowerCase();
    return `assets/images/maps/${name}-d.png`;
  }

  get freeMinTextCss() {
    return `text-${this.countryTo.CountryId}`;
  }

  countryChange(country: any) {
  console.log("Hello Aj");
    this.countryTo = country;
    this.planDenominations = this.getDenominationByCountry(country.CountryId);
	 
  }
   
	openDialog (country:any){
	  var obj = this.getDenominationByCountry(country.CountryId);
          this.dialog.open(GlobalratesDialogComponent, {
            data:{list:obj, country:country},
             
            width: '85vw',
            maxWidth: '1235px'
          });
        
		}
  getDenominationByCountry(countryId: number): PromotionPlanDenomination[] {
    return this.plan.Denominations.filter(a => a.CountryToId === countryId);
  }


  buyDeal(item: PromotionPlanDenomination) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.plan.CardId;
    model.CardName = this.plan.CardName;
    model.CurrencyCode = item.CurrencyCode;
    model.details = {
      Price: item.Price,
      ServiceCharge: this.plan.ServiceCharge ? this.plan.ServiceCharge : 0,
      SubCardId: item.SubCardId
    }
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.countryTo.CountryId;
    model.currencyCode = item.CurrencyCode
    model.transactiontype = TransactionType.Activation;
    model.isAutoRefill = false;
    model.couponCode = this.plan.CouponCode;
    model.isHideCouponEdit = !this.plan.IsEditCoupon;

    this.checkoutService.setCurrentCart(model);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

onClickInput() { }
onClickClose(icon) {
    if (icon == '../assets/images/cross8.png') {
      // this.searchicon = '../assets/images/search8.svg';
    }
    this.showDropdown = false;
  }
  openFlagDropDown() {

    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
  }
    onInputFocus() {
    //this.searchicon = '../assets/images/cross8.png';
    this.showDropdown = false;
    this.showPlaceholder = false;
  }


 
  

}
