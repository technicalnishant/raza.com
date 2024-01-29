import { Component, OnInit } from '@angular/core';
import { CurrentSetting } from 'app/core/models/current-setting';
import { Subscription } from 'rxjs/internal/Subscription';
import { CheckoutService } from '../services/checkout.service';
import { AuthenticationService } from 'app/core/services/auth.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { NewPlanCheckoutModel } from '../models/checkout-model';
import { Denominations } from 'app/globalrates/model/denominations';
import { TransactionType } from 'app/payments/models/transaction-request.model';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-set-cart',
  templateUrl: './set-cart.component.html',
  styleUrls: ['./set-cart.component.scss']
})
export class SetCartComponent implements OnInit {
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  country_to:any;
  card_id:any;
  card_name:any;
  curr_code:any
  
  isAutorefill = false;
  constructor(
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;

      this.currentSetting.country.CountryId
    });
  }

  ngOnInit(): void {
    this.card_id = this.route.snapshot.paramMap.get('card_id');
    this.card_name = this.route.snapshot.paramMap.get('card_name');
    this.curr_code = this.route.snapshot.paramMap.get('curr_code');
    this.country_to = this.route.snapshot.paramMap.get('country_to');
  }

 

  
  //GlobalPlansData
  onClickRateTab(item: Denominations) {
    const model: NewPlanCheckoutModel = new NewPlanCheckoutModel();

    model.CardId = this.card_id;
    model.CardName = this.card_name;
    model.CurrencyCode = this.curr_code;
    model.details = item;
    model.country = null;
    model.phoneNumber = null;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = this.country_to;
    model.couponCode = '';
    model.currencyCode = this.curr_code;
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
