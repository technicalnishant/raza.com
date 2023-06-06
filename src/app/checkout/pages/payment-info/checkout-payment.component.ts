import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import { isNullOrUndefined } from 'util';
import { Subscription } from 'rxjs';
import { IPayPalConfig } from '../../../payments/paypal/model/paypal.model';
import { PurchasePlanReqModel } from '../../../purchase/models/purchase-plan-req.model';
import { Country } from '../../../core/models/country.model';
import { CodeValuePair } from '../../../core/models/codeValuePair.model';
import { State } from '../../../accounts/models/billingInfo';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../services/checkout.service';
import { ICheckoutModel } from '../../models/checkout-model';
import { MatDialog } from '@angular/material/dialog';
import { RedeemPromoComponent } from '../../components/redeem-promo/redeem-promo.component';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { isNullOrUndefined } from "../../../shared/utilities";
import { BreakpointObserver } from '@angular/cdk/layout'; 
@Component({
  selector: 'app-payment-info',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit, OnDestroy {
  subscriptions$: Subscription;
  currentCart: ICheckoutModel;
  public payPalConfig?: IPayPalConfig;
  purchasePlanReq: PurchasePlanReqModel;
  countries: Country[]
  months: CodeValuePair[];
  years: CodeValuePair[];
  states: State[];
  isLoggedIn: boolean = false;

  isPromotion:boolean = false;
  promoCode:string='';
  stepper:boolean=true;
  isSmallScreen;
  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private razaLayoutService: RazaLayoutService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {

    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
    this.currentCart = this.route.snapshot.data['cart'];

    
   // this.isPromotion = this.currentCart.isPromotion;
    this.promoCode = this.currentCart.couponCode;

   

    if(localStorage.getItem('promotionCode') != this.promoCode)
    this.promoCode = '';
    
    console.log(TransactionType.Sale);
    this.razaLayoutService.setFixedHeader(true);
    if (this.currentCart.transactiontype === TransactionType.Sale) {
      this.router.navigate(['/checkout/payment-info/switch-pinless']);
    }

  }

  ngOnDestroy(): void {
  }

  openPromoDialog() {
    const dialogOtpConfirm = this.dialog.open(RedeemPromoComponent,
      {
        data: {
          cart: this.currentCart
        }
      });

    dialogOtpConfirm.afterClosed().subscribe(promoCode => {
      if (!isNullOrUndefined(promoCode)) {
        this.currentCart.couponCode = promoCode;
        this.checkoutService.setCurrentCart(this.currentCart);
      }
    },
      err => { },
    )
  }

  getCustomPromocode()
  {
     
    var custom_text = localStorage.getItem('promo' );
    if(custom_text && typeof custom_text !== 'undefined' &&( this.currentCart.couponCode=='BONUS' || this.currentCart.couponCode=='UPSELL' )  )
    {
      return custom_text;
    }
    else{
      return this.currentCart.couponCode;
    }
  }
  
}
