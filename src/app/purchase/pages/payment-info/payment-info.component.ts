import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//import { isNullOrUndefined } from 'util';

import { TransactionService } from '../../../payments/services/transaction.service';
import { CheckoutService } from '../../../checkout/services/checkout.service';

import { Country } from '../../../core/models/country.model';
import { CodeValuePair } from '../../../core/models/codeValuePair.model';
import { ICheckoutOrderInfo } from '../../../payments/models/planOrderInfo.model';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { State } from '../../../accounts/models/billingInfo';
import { IOnApproveCallbackData, IPayPalConfig } from '../../../payments/paypal/model/paypal.model';
import { GenerateTransactionRequestModel } from '../../../payments/models/generate-transaction-req.model';
import { environment } from '../../../../environments/environment';
import { ICheckoutModel } from '../../../checkout/models/checkout-model';
import { CreditCard } from '../../../accounts/models/creditCard';
import { of } from 'rxjs';
import { isNullOrUndefined } from "../../../shared/utilities";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, OnDestroy {

  public payPalConfig?: IPayPalConfig;
  currentCart: ICheckoutModel;
  countries: Country[]
  months: CodeValuePair[];
  years: CodeValuePair[];
  states: State[];

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.getCurrentCart();
    this.initPaypalConfig();

  }

  ngOnDestroy(): void {
  }

  /* Get Purchased Plan. */
  getCurrentCart() {
    this.checkoutService.getCurrentCart().subscribe(
      (res: ICheckoutModel) => {
        // console.log("current cart is", res);
        this.currentCart = res;
      },
      err => { },
      () => {
        if (isNullOrUndefined(this.currentCart)) {
          this.router.navigate(['/']);
        }
      })
  }

  onPaymentInfoFormSubmit(creditCard: CreditCard) {
    // console.log("Out event occurred");
    this.onCreditCardPayment(creditCard);
  }

  /**
   * On credit card payment Option.
   */
  private onCreditCardPayment(creditCard: CreditCard) {
    const planOrderInfo: ICheckoutOrderInfo = {
      creditCard: creditCard,
      checkoutCart: this.currentCart
    }

    this.transactionService.processPaymentToCentinel(planOrderInfo);


  }

  // Intitiate paypal config
  private initPaypalConfig(): void {
    if (isNullOrUndefined(this.currentCart)) {
      return;
    }

    this.payPalConfig = {
      currency: this.currentCart.currencyCode.toString(),
      clientId: environment.paypalClientId,
      createOrderOnServer: () => {
        let generateTranreqModel = new GenerateTransactionRequestModel();
        //generateTranreqModel.
        generateTranreqModel.purchaseAmount = this.currentCart.totalAmount();
        generateTranreqModel.transactionType = TransactionType.Activation;

        return this.transactionService.generatePaypalOrder(generateTranreqModel).toPromise();
      },
      advanced: {
        updateOrderDetails: {
          commit: true
        },
        extraQueryParams: [
          { name: 'intent', value: 'authorize' },
          { name: 'disable-funding', value: 'credit,card' }
        ]
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      authorizeOnServer: (data, actions) => {
        console.log('authorizeOnServer - you should probably inform your server to autorize and capture transaction at this point', data);
        return this.onPaypalPaymentApprove(data);
      },
      // onClientAuthorization: (data) => {
      //     console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      // },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: () => {
        console.log('onClick');
      },
    };
  }


  /* On paypal payment approve. */
  onPaypalPaymentApprove(data: IOnApproveCallbackData): Promise<any> {
    console.log("On paypal payment approve", data);
    // let modelInfo: RechargeRequestModel = {
    //   OrderId: data.orderID,
    //   Amount: this.rechargeOptionsModel.purchaseAmount,
    //   CouponCode: '',
    //   PaymentMethod: PaymentMethod.Paypal,
    //   IsPaymentProcessed: false,
    //   CreditCardId: 0,
    //   Cvv2: '',
    //   PaymentTransactionId: data.orderID,
    //   Cavv: '',
    //   EciFlag: '',
    //   Xid: '',
    //   IpAddress: '',
    //   PayPalPayerId: data.payerID,
    //   IsAutoReFill: false,
    //   AutoReFillAmount: 0,
    //   AddressResponse: null,
    //   CustomerId: 0,
    //   Cvv2Response: '',
    //   ZipCodeResponse: ''
    // };

    // this.rechargeService.ProcessRecharge(this.plan.Pin, modelInfo).subscribe(
    //   (res: TransactionResponseModel) => {
    //     this.router.navigate(['recharge/confirmation', modelInfo.OrderId]);
    //   }
    // )

    return of(true).toPromise();

  }

}
