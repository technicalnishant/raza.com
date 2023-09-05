import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';

import { PlanService } from '../../../accounts/services/planService';
import { CustomerService } from '../../../accounts/services/customerService';
import { TransactionService } from '../../../payments/services/transaction.service';
import { RechargeService } from '../../services/recharge.Service';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';

import { TransactionType } from '../../../payments/models/transaction-request.model';
import { TransactionResponseModel } from '../../../payments/models/transaction-response.model';
import { BillingInfo } from '../../../accounts/models/billingInfo';
import { GenerateTransactionRequestModel } from '../../../payments/models/generate-transaction-req.model';
import { RechargeRequestModel } from '../../models/recharge-trans-request.model';
import { PaymentMethod } from '../../../payments/models/payment-method';
import { RechargeOrderInfo } from '../../../payments/models/planOrderInfo.model';
import { IsCentinelBypassRequestModel } from '../../../payments/models/isCentinelByPass-request.model';
import { IPayPalConfig, IOnApproveCallbackData } from '../../../payments/paypal/model/paypal.model';
import { Plan } from '../../../accounts/models/plan';
import { RechargeOptionsModel } from '../../models/recharge-options.model';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { RechargeCheckoutModel } from '../../../checkout/models/checkout-model';
import { CurrencyCode } from '../../../core/interfaces/CurrencyCode';
import { CreditCard } from '../../../accounts/models/creditCard';

import { AddCreditcardDialog } from '../../../accounts/dialog/add-creditcard-dialog/add-creditcard-dialog';
import { environment } from '../../../../environments/environment';
import { of } from 'rxjs';
import { isNullOrUndefined } from "../../../shared/utilities";

declare var paypal: any;

@Component({
  selector: 'app-recharge-payment',
  templateUrl: './recharge-payment.component.html',
  styleUrls: ['./recharge-payment.component.scss']
})
export class RechargePaymentComponent implements OnInit {

  plan: Plan;
  selectedCard: CreditCard;
  customerSavedCards: CreditCard[];
  serviceFee: number;
  paymentMethod: PaymentMethod = PaymentMethod.CreditCard;
  rechargeOptionsModel: RechargeOptionsModel;
  billingInfo: BillingInfo;

  constructor(
    private planService: PlanService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private rechargeService: RechargeService,
    private dialog: MatDialog,
    private razaSnackbarService: RazaSnackBarService,
  ) { }

  public payPalConfig?: IPayPalConfig;

  ngOnInit() {

    let pin = this.route.snapshot.paramMap.get('pin');
    RechargeService.selectedRechargeAmount.subscribe((res: RechargeOptionsModel) => {
      this.rechargeOptionsModel = res;
      this.rechargeOptionsModel.purchaseAmount = 2;
    });

    this.getCustomerCards();
    this.loadBillingInfo();

    //get plan .
    this.planService.getPlan(pin).subscribe(
      (res: Plan) => {
        this.plan = res;
        this.serviceFee = this.plan.ServiceChargePercent * this.rechargeOptionsModel.purchaseAmount / 100;
      },
      err => console.log(err),
      () => { this.initPaypalConfig(); }

    )
  }

  /* Get customer card */
  getCustomerCards() {
    this.customerService.getSavedCreditCards().subscribe(
      (res: CreditCard[]) => {
        this.customerSavedCards = res.splice(0, 2);
        if (!isNullOrUndefined(this.rechargeOptionsModel.creditCardLastDigit)) {
          if (this.rechargeOptionsModel.creditCardLastDigit.length === 5) {
            const card = this.customerSavedCards
              .find(a => a.CardNumber.endsWith(this.rechargeOptionsModel.creditCardLastDigit));
            if (!isNullOrUndefined(card)) {
              this.selectedCard = card;
              this.selectedCard.Cvv = this.rechargeOptionsModel.cvv;
            }
          }

        }
      }
    )
  }

  // Intitiate paypal config
  private initPaypalConfig(): void {
    this.payPalConfig = {
      currency: this.plan.CurrencyCode.toString(),
      clientId: environment.paypalClientId,
      createOrderOnServer: () => {
        let generateTranreqModel = new GenerateTransactionRequestModel();
        generateTranreqModel.planId = this.plan.PlanId;
        generateTranreqModel.purchaseAmount = this.rechargeOptionsModel.purchaseAmount
        generateTranreqModel.transactionType = TransactionType.Recharge;

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


  /* Calculate service fee*/
  calculateServiceFee(): number {
    return this.plan.ServiceChargePercent * this.rechargeOptionsModel.purchaseAmount / 100;
  }

  /* On paypal payment approve. */
  onPaypalPaymentApprove(data: IOnApproveCallbackData): Promise<any> {

    let modelInfo: RechargeRequestModel = {
      OrderId: data.orderID,
      Amount: this.rechargeOptionsModel.purchaseAmount,
      CouponCode: '',
      PaymentMethod: PaymentMethod.Paypal,
      IsPaymentProcessed: false,
      CreditCardId: 0,
      Cvv2: '',
      PaymentTransactionId: data.orderID,
      Cavv: '',
      EciFlag: '',
      Xid: '',
      IpAddress: '',
      PayPalPayerId: data.payerID,
      IsAutoReFill: false,
      AutoReFillAmount: 0,
      AddressResponse: null,
      CustomerId: 0,
      Cvv2Response: '',
      ZipCodeResponse: '',
	  nonce:'',
    ProcessedBy:'',
    ActualAmountCharge: parseFloat(localStorage.getItem('ActualAmountCharge')),
      PaymentCurrency:localStorage.getItem('PaymentCurrency')
    };

    this.rechargeService.ProcessRecharge(this.plan.Pin, modelInfo).subscribe(
      (res: TransactionResponseModel) => {
        this.router.navigate(['recharge/confirmation', modelInfo.OrderId]);
      }
    )

    return of(true).toPromise();

  }


  onClickCreditCardPayment(): void {

    let isCentinelByPass: IsCentinelBypassRequestModel = new IsCentinelBypassRequestModel();
    isCentinelByPass.CardNumber = this.selectedCard.CardNumber;
    isCentinelByPass.DestinationCountry = this.plan.CountryFrom;
    isCentinelByPass.PaymentMethod = PaymentMethod.CreditCard;
    isCentinelByPass.TransactionType = TransactionType.Recharge;

    const rechModel: RechargeCheckoutModel = {
      couponCode: '',
      currencyCode: CurrencyCode.USD,//this.plan.CurrencyCode,
      cvv: this.selectedCard.Cvv,
      purchaseAmount: this.rechargeOptionsModel.purchaseAmount,
      planId: this.plan.PlanId,
      transactiontype: TransactionType.Recharge,
      serviceChargePercentage: this.plan.ServiceChargePercent,
      planName: this.plan.CardName,
      countryFrom: this.plan.CountryFrom,
      countryTo: this.plan.CountryTo,
      cardId: this.plan.CardId,
      offerPercentage:'',
      ProcessedBy:''
    };

    const planOrderInfo: RechargeOrderInfo = {
      creditCard: this.selectedCard,
      checkoutCart: rechModel
    };

    return this.transactionService.processPaymentToCentinel(planOrderInfo);

    this.transactionService.isCentinelByPass(isCentinelByPass).subscribe(
      (res: boolean) => {
        if (res) {
          console.log("Neeed to bypass 3D secure flow.");
          //return this.transactionService.processPaymentToCentinel(plaOrderInfo, this.selectedCard, this.rechargeOptionsModel.purchaseAmount, TransactionType.Recharge);
          //return this.processRechargeWithBypassCentinel();
        }
        else {
          // return this.transactionService.processPaymentToCentinel(plaOrderInfo, this.selectedCard, this.rechargeOptionsModel.purchaseAmount, TransactionType.Recharge)
        }
      }
    );
  }


  processRechargeWithBypassCentinel(): void {
    console.log("")
  }

  editCardDetails(card) {
    this.customerService.EditCreditCard(card).subscribe(data => {
      this.cardBillingAddress(data);
    });
  }


  cardBillingAddress(data) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: data,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
      if (result == "success") {
        this.getCustomerCards();
        this.loadBillingInfo();
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )

  }

  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res; },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

}


