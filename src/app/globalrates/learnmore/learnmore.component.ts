import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalRatesService } from '../globalrates.service';

import { Denominations } from '../model/denominations';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { Subscription } from 'rxjs';
import { CurrentSetting } from '../../core/models/current-setting';
import { NewPlanCheckoutModel } from '../../checkout/models/checkout-model';
import { TransactionType } from '../../payments/models/transaction-request.model';
import { CheckoutService } from '../../checkout/services/checkout.service';
import { GlobalPlansData } from '../model/globalPlansData';
import { AuthenticationService } from '../../core/services/auth.service';

@Component({
  selector: 'app-learnmore',
  templateUrl: './learnmore.component.html',
  styleUrls: ['./learnmore.component.scss']
})
export class LearnmoreComponent implements OnInit {
  AutorefillPlans: Denominations[] = [];
  WithoutAutorefillPlans: Denominations[] = [];
  globalPlanData: GlobalPlansData;
  Plans: Denominations[] = [];
  RatePerMinPromo: number;
  RatePerMinWithOutPromo: number;
  RatePerMin: number;
  countryName: string;
  isAutorefill = true;
  countryId: number;
  mode = new FormControl('over');
  headerValue: number = 1;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isAutoRefillEnable: boolean = false;
  learnMoreForm: FormGroup;
  amount: number = 1;
  amount2: number = 1;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private checkoutService: CheckoutService,
    private searchRatesService: GlobalRatesService,
    private formBuilder: FormBuilder,
    private razaEnvService: RazaEnvironmentService,
    private authService: AuthenticationService,
  ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Learn more');
    this.countryId = +this.route.snapshot.queryParamMap.get('country');

    this.createLearnMoreForm();
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
    this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, this.countryId).subscribe(
      (data: any) => {
        this.countryName = data.CountryName;
        this.RatePerMinPromo = data.AutorefillPlans.RatePerMin;
        this.RatePerMin = this.RatePerMinPromo;
        this.AutorefillPlans = data.AutorefillPlans.Denominations;
        this.Plans = this.AutorefillPlans;
        this.RatePerMinWithOutPromo = data.WithoutAutorefillPlans.RatePerMin;
        this.WithoutAutorefillPlans = data.WithoutAutorefillPlans.Denominations;
        this.globalPlanData = data;
      }
    );

  }

  createLearnMoreForm() {
    this.learnMoreForm = this.formBuilder.group({
      toggle1: new FormControl('true'),
      matRadioBtn1: new FormControl(''),
      toggle2: new FormControl('true'),
      matRadioBtn2: new FormControl('')
    });
  }


  onSelectionChange(event) {
    this.amount = event.value;
  }
  onSelectionChange2(event) {
    this.amount2 = event.value;
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

  onLearnMoreFormSubmit(btnclicked: number) {

    // const model: RechargeCheckoutModel = new RechargeCheckoutModel();

    let selectedDenomination: Denominations;
    if (btnclicked == 1 && this.amount == 2)
      selectedDenomination = this.Plans[2];
    else if (btnclicked == 2 && this.amount2 == 2)
      selectedDenomination = this.Plans[2];
    else
      selectedDenomination = this.Plans[3];

    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.globalPlanData.CardId;
    model.CardName = this.globalPlanData.CardName;
    model.CurrencyCode = this.globalPlanData.CurrencyCode;
    model.details = selectedDenomination;
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

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/checkout/payment-info']);
    } else {
      this.router.navigate(['/checkout']);
    }

  }
}
