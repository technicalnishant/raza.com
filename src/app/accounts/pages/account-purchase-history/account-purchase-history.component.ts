import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customerService';
import { OrderHistory } from '../../models/orderHistory';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Title } from '@angular/platform-browser';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { RechargeCheckoutModel } from 'app/checkout/models/checkout-model';
import { TransactionType } from 'app/payments/models/transaction-request.model';
import { CheckoutService } from 'app/checkout/services/checkout.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { CurrentSetting } from 'app/core/models/current-setting';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-purchase-history',
  templateUrl: './account-purchase-history.component.html',
  styleUrls: ['./account-purchase-history.component.scss']
})
export class AccountPurchaseHistoryComponent implements OnInit {
  orderHistoryPage: number = 1;
  orderHistoryList: OrderHistory[] = [];
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private titleService: Title,
    private razalayoutService: RazaLayoutService,
    private checkoutService: CheckoutService,
    private razaEnvService: RazaEnvironmentService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Order History')
    this.razalayoutService.setFixedHeader(true);
    this.loadOrderHistory();

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
       
    })

  }


  recharge(item:any) { 
    //this.router.navigateByUrl("recharge/"+ item.PlanId);
    const model: RechargeCheckoutModel = new RechargeCheckoutModel();
    model.purchaseAmount = item.Price;
    model.couponCode = '';
    model.currencyCode = item.CurrencyCode;
    model.cvv = '';
    model.planId = item.PlanId;
    model.transactiontype = TransactionType.Recharge;
    model.serviceChargePercentage = item.ServiceChargeParcent;  
    model.planName = item.CardName;
    model.countryFrom = this.currentSetting.currentCountryId;
    model.countryTo = item.CountryTo?item.CountryTo:1;
    model.cardId = item.CardId;
    model.isAutoRefill = item.isAutoRefillEnable;
	  model.offerPercentage = '';
    this.checkoutService.setCurrentCart(model); 
    //this.router.navigate(['/checkout/payment-info']);
    //this.router.navigate(['/account/overview']);
    this.router.navigateByUrl('/account/overview', { state: { price: item.Price } });
  
  }

  rechargeRedirect(obj)
  {
   // console.log(obj);
   // this.router.navigate(['/b'], {state: {data: {...}}});
    //this.router.navigateByUrl("mobiletopup");
   
    var card = obj.CardName;
   card = card.split(' ');
   var iso = card[0];
   
   this.router.navigateByUrl('mobiletopup', { state: { pin: obj.Pin, iso:iso } });

  }
  
  onClickShowMore() {
    this.orderHistoryPage = this.orderHistoryPage + 1;
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.customerService.getOrderHistory(this.orderHistoryPage).subscribe(
      (data: OrderHistory[]) => {
      //  console.log('data',data);
        //this.orderHistoryList = data;
        data.map(a => {
          this.orderHistoryList.push(a);
        });
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
}
