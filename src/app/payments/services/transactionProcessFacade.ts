import { Injectable, NgZone } from '@angular/core';
import { RechargeService } from '../../recharge/services/recharge.Service';
import { Router } from '@angular/router';
import { TransactionRequest, TransactionType } from '../models/transaction-request.model';
import { CardinalResponse } from '../models/cardinal-response.model';
import { RechargeRequestModel } from '../../recharge/models/recharge-trans-request.model';
import { PaymentMethod } from '../models/payment-method';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/dialog/error-dialog/error-dialog.component';
import { ErrorDialogModel } from '../../shared/model/error-dialog.model';
import { TransactionResponseModel } from '../models/transaction-response.model';
import { PurchaseService } from '../../purchase/services/purchase.service';
import { newPinRequestModel } from '../../purchase/models/new-pin-Request.model';
import { RechargeOrderInfo, ActivationOrderInfo, IPaypalCheckoutOrderInfo, MobileTopupOrderInfo } from '../models/planOrderInfo.model';
import { RechargeCheckoutModel, NewPlanCheckoutModel, MobileTopupCheckoutModel } from '../../checkout/models/checkout-model';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { Observable } from 'rxjs';
import { MobileTopupRequestModel } from '../../mobiletopup/model/mobile-topup-Request.model';
import { AuthenticationService } from '../../core/services/auth.service';
import { MobiletopupService } from '../../mobiletopup/mobiletopup.service';
import { CheckoutService } from '../../checkout/services/checkout.service';

@Injectable({
  providedIn: "root"
})
export class TransactionProcessFacadeService {

  constructor(
    private rechargeService: RechargeService,
    private purchaseService: PurchaseService,
    private router: Router,
    public dialog: MatDialog,
    private ngZone: NgZone,
    private authService: AuthenticationService,
    private topupService: MobiletopupService,
    private checkoutService: CheckoutService
  ) { }

  processTransaction(transactionReq: TransactionRequest, cardinalResponse: CardinalResponse) {
    console.log("Step payment page");
    console.log(transactionReq);
    console.log(TransactionType.MR);
    switch (transactionReq.TransactionType) {
      case TransactionType.Recharge: {
        this.processRecharge(transactionReq, cardinalResponse);
        break;
      }
      case TransactionType.MR: {
        this.processRecharge(transactionReq, cardinalResponse);
        break;
      }
      case TransactionType.Sale: {
        this.processNewActivation(transactionReq, cardinalResponse);
        break;
      }
      case TransactionType.Activation: {
        this.processNewActivation(transactionReq, cardinalResponse);
        break;
      }
      case TransactionType.Topup: {
        this.processMobileTopup(transactionReq, cardinalResponse);
        break;
      }
    }
  }

  onNoActionResult(transactionReq: TransactionRequest, cardinalResponse: CardinalResponse) {
    let error = new ErrorDialogModel();
    error.header = 'Transaction Declined';
    error.message = 'Please check your information and try again.';
    this.ngZone.run(() => {
      this.openErrorDialog(error);
    });
  }

  processNewActivation(transactionReq: TransactionRequest, cardinalResponse: CardinalResponse) {
    let order = transactionReq.Order;
    const orderInfo = transactionReq.checkoutOrderInfo as ActivationOrderInfo;
    const activationCart: NewPlanCheckoutModel = orderInfo.checkoutCart as NewPlanCheckoutModel;
    const model: newPinRequestModel = {
      orderId: order.OrderDetails.OrderNumber,
      amount: order.OrderDetails.Amount / 100,
      couponCode: orderInfo.checkoutCart.couponCode,
      paymentMethod: PaymentMethod.CreditCard,
      isPaymentProcessed: false,
      creditCardId: 0,//transactionReq.creditCard.CardId,
      cvv2: orderInfo.creditCard.Cvv,
      paymentTransactionId: cardinalResponse.Payment.ProcessorTransactionId,
      zipCodeResponse: '',
      addressResponse: '',
      cvv2Response: '',
      cavv: cardinalResponse.Payment.ExtendedData.CAVV,
      eciFlag: cardinalResponse.Payment.ExtendedData.ECIFlag,
      xid: cardinalResponse.Payment.ExtendedData.XID,
      ipAddress: '',
      payPalPayerId: '',
      isAutoReFill: activationCart.isAutoRefill,
      autoReFillAmount: order.OrderDetails.Amount / 100,
      cardId: activationCart.CardId,
      subCardId: activationCart.details.SubCardId,
      countryFrom: activationCart.countryFrom,
      countryTo: activationCart.countryTo,
      pinlessNumbers: activationCart.pinlessNumbers,
      creditCard: orderInfo.creditCard,
	  nonce : '',
    ProcessedBy : ''
    };

    let transactionResponseModel: TransactionResponseModel;
    this.purchaseService.issueNewPin(model).subscribe((res: TransactionResponseModel) => {
      transactionResponseModel = res;
    },
      err => {
        let error = new ErrorDialogModel();
        error.header = 'Transaction Declined';
       // error.message = 'Please check your information and try again.';
        error.message = err.error.Message;
        this.ngZone.run(() => {
          this.openErrorDialog(error);
        });
      },
      () => {
        if (transactionResponseModel.Status) {
          PurchaseService.processedTransaction.next(transactionReq);
          if(orderInfo.checkoutCart.couponCode =='FREETRIAL')
          {
            this.navigateToConfirmationFreePage(model.orderId)
          }
          else{
            this.navigateToConfirmationPage(model.orderId)
          }
          
        } else {
          let error = new ErrorDialogModel();
          error.header = 'Transaction Declined';
          error.message = 'Please check your information and try again.'; //transactionResponseModel.ErrorMessages[0];
          this.ngZone.run(() => {
            this.openErrorDialog(error);
          });
        }
      });
  }

  /* Process recharge transaction. */
  processRecharge(transactionReq: TransactionRequest, cardinalResponse: CardinalResponse) {
    let model = new RechargeRequestModel();
    let order = transactionReq.Order;
    const orderInfo = transactionReq.checkoutOrderInfo as RechargeOrderInfo;
    const rechargeCheckOutModel = orderInfo.checkoutCart as RechargeCheckoutModel;
    model.OrderId = order.OrderDetails.OrderNumber;
    //model.CustomerId: 
    model.Amount = order.OrderDetails.Amount / 100;
    model.CouponCode = orderInfo.checkoutCart.couponCode;
    model.PaymentMethod = PaymentMethod.CreditCard;
    model.IsPaymentProcessed = false;
    model.CreditCardId = transactionReq.checkoutOrderInfo.creditCard.CardId;
    model.Cvv2 = transactionReq.checkoutOrderInfo.creditCard.Cvv;
    model.PaymentTransactionId = cardinalResponse.Payment.ProcessorTransactionId;
    model.Cavv = cardinalResponse.Payment.ExtendedData.CAVV;
    model.EciFlag = cardinalResponse.Payment.ExtendedData.ECIFlag;
    model.Xid = cardinalResponse.Payment.ExtendedData.XID;
    model.IpAddress = '';
    model.PayPalPayerId = '';
    model.IsAutoReFill = rechargeCheckOutModel.isAutoRefill;
    model.AutoReFillAmount = rechargeCheckOutModel.purchaseAmount;
	model.nonce = '';
  model.ProcessedBy = '';
  model.ActualAmountCharge  =parseFloat(localStorage.getItem('ActualAmountCharge'));
  model.PaymentCurrency=localStorage.getItem('PaymentCurrency');
    let transactionResponseModel: TransactionResponseModel;
    /* Process recharge. */
    const rechargeCart = orderInfo.checkoutCart as RechargeCheckoutModel
    this.rechargeService.ProcessRecharge(rechargeCart.planId, model).subscribe(
      (res: TransactionResponseModel) => {
        transactionResponseModel = res;

      }, err => {
        let error = new ErrorDialogModel();
        error.header = 'Transaction Declined';
        error.message = 'Please check your information and try again.';
        this.ngZone.run(() => {
          this.openErrorDialog(error);
        });
      },
      () => {
        this.checkoutService.setTransResponse(transactionResponseModel);
        if (transactionReq.checkoutOrderInfo.logoutAfterProcess) {
          this.authService.logout();
        }
        if (transactionResponseModel.Status) {
          this.navigateToConfirmationPage(model.OrderId)
        } else {
          let error = new ErrorDialogModel();
          error.header = 'Transaction Declined';
          error.message = transactionResponseModel.ErrorMessages[0];
          this.ngZone.run(() => {
            this.openErrorDialog(error);
          });
        }
      }
    )
  }

  processMobileTopup(transactionReq: TransactionRequest, cardinalResponse: CardinalResponse) {

    let order = transactionReq.Order;
    const orderInfo = transactionReq.checkoutOrderInfo as MobileTopupOrderInfo;
    const currentCart: MobileTopupCheckoutModel = orderInfo.checkoutCart as MobileTopupCheckoutModel;
    const model: MobileTopupRequestModel = {
      OrderId: order.OrderDetails.OrderNumber,
      CurrencyCode: orderInfo.checkoutCart.currencyCode,
      CouponCode: orderInfo.checkoutCart.couponCode,
      PaymentMethod: PaymentMethod.CreditCard,
      IsPaymentProcessed: false,
      CreditCardId: orderInfo.creditCard.CardId,
      Cvv2: orderInfo.creditCard.Cvv,
      PaymentTransactionId: cardinalResponse.Payment.ProcessorTransactionId,
      ZipCodeResponse: '',
      AddressResponse: '',
      Cvv2Response: '',
      Cavv: cardinalResponse.Payment.ExtendedData.CAVV,
      EciFlag: cardinalResponse.Payment.ExtendedData.ECIFlag,
      Xid: cardinalResponse.Payment.ExtendedData.XID,
      IpAddress: '',
      PayPalPayerId: '',
      Operator: currentCart.topupOption.Operator,
      OperatorCode: currentCart.topupOption.ProductId.toString(),
      CountryId: currentCart.topupOption.CountryId,
      PurchaseAmount: currentCart.getPurchaseAmount(),
      SourceAmount: currentCart.topupOption.UsDenomination,
      DestinationAmt: currentCart.topupOption.DestinationAmount,
      DestinationCountryCode: currentCart.country.CountryCode,
      DestinationPhoneNumber: currentCart.phoneNumber,
      SmsTo: '',
      StoreNumber: 0,
      creditCard: orderInfo.creditCard,
	    nonce:''
    };

    let transactionResponseModel: TransactionResponseModel;
    this.topupService.ProcessTopupRecharge(model).subscribe((res: TransactionResponseModel) => {
      transactionResponseModel = res;
    },
      err => {
        console.log(err.error.Message);
        let error = new ErrorDialogModel();
        error.header = 'Transaction Declined';
      //  error.message = 'Please check your information and try again.';
        error.message = err.error.Message;
        this.ngZone.run(() => {
          this.openErrorDialog(error);
        });
      },
      () => {
        if (transactionResponseModel.Status) {
          PurchaseService.processedTransaction.next(transactionReq);
          this.navigateToConfirmationPage(model.OrderId);
        } else {
          let error = new ErrorDialogModel();
          error.header = 'Transaction Declined';
          error.message = 'Please check your information and try again.2'; //transactionResponseModel.ErrorMessages[0];
          this.ngZone.run(() => {
            this.openErrorDialog(error);
          });
        }
      });
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }

  processPaypalTransaction(transactionType: TransactionType, paypalCheckoutOrderInfo: IPaypalCheckoutOrderInfo) {
    if (transactionType === TransactionType.Recharge) {
      this.processRechargeWithPaypal(paypalCheckoutOrderInfo);
    } else if (transactionType === TransactionType.Activation || transactionType === TransactionType.Sale) {
      this.processNewActivationWithPaypal(paypalCheckoutOrderInfo);
    }
  }

  private processRechargeWithPaypal(paypalCheckoutOrderInfo: IPaypalCheckoutOrderInfo) {
    const rechargeCheckoutModel: RechargeCheckoutModel = paypalCheckoutOrderInfo.checkoutCart as RechargeCheckoutModel;
    let modelInfo: RechargeRequestModel = {
      OrderId: paypalCheckoutOrderInfo.orderId,
      Amount: rechargeCheckoutModel.purchaseAmount,
      CouponCode: rechargeCheckoutModel.couponCode,
      PaymentMethod: PaymentMethod.Paypal,
      IsPaymentProcessed: false,
      CreditCardId: 0,
      Cvv2: '',
      PaymentTransactionId: paypalCheckoutOrderInfo.paymentTransactionId,
      Cavv: '',
      EciFlag: '',
      Xid: '',
      IpAddress: '',
      PayPalPayerId: paypalCheckoutOrderInfo.paypalPayerId,
      IsAutoReFill: false,
      AutoReFillAmount: 0,
      AddressResponse: null,
      CustomerId: 0,
      Cvv2Response: '',
      ZipCodeResponse: '',
      nonce : '',
      ProcessedBy:'',
      ActualAmountCharge :parseFloat(localStorage.getItem('ActualAmountCharge')),
   PaymentCurrency :localStorage.getItem('PaymentCurrency'),
    };
    let transactionResponseModel: TransactionResponseModel;
    this.rechargeService.ProcessRecharge(rechargeCheckoutModel.planId, modelInfo).subscribe(
      (res: TransactionResponseModel) => {
        transactionResponseModel = res;
      }, err => {
        let error = new ErrorDialogModel();
        error.header = 'Transaction Declined';
       // error.message = 'Please check your information and try again.';
        error.message = err.error.Message;
        this.ngZone.run(() => {
          this.openErrorDialog(error);
        });
      },
      () => {
        if (transactionResponseModel.Status) {
          this.checkoutService.setTransResponse(transactionResponseModel);
          this.navigateToConfirmationPage(transactionResponseModel.OrderId)
        } else {
          let error = new ErrorDialogModel();
          error.header = 'Transaction Declined';
          error.message = transactionResponseModel.ErrorMessages[0];
          this.ngZone.run(() => {
            this.openErrorDialog(error);
          });
        }
      }
    );
  }

  private processNewActivationWithPaypal(paypalCheckoutOrderInfo: IPaypalCheckoutOrderInfo) {
    //console.log('processNewActivationWithPaypal');

    const checkoutModel: NewPlanCheckoutModel = paypalCheckoutOrderInfo.checkoutCart as NewPlanCheckoutModel;
    const model: newPinRequestModel = {
      orderId: paypalCheckoutOrderInfo.orderId,
      amount: checkoutModel.details.Price,
      couponCode: checkoutModel.couponCode,
      paymentMethod: PaymentMethod.Paypal,
      isPaymentProcessed: false,
      creditCardId: 0,
      cvv2: '',
      paymentTransactionId: paypalCheckoutOrderInfo.paymentTransactionId,
      zipCodeResponse: '',
      addressResponse: '',
      cvv2Response: '',
      cavv: '',
      eciFlag: '',
      xid: '',
      ipAddress: '',
      payPalPayerId: paypalCheckoutOrderInfo.paypalPayerId,
      isAutoReFill: false,
      autoReFillAmount: 0,
      cardId: checkoutModel.CardId,
      subCardId: checkoutModel.details.SubCardId,
      countryFrom: checkoutModel.countryFrom,
      countryTo: checkoutModel.countryTo,
      pinlessNumbers: ['0002520101'],
      creditCard: null,
      nonce :'',
      ProcessedBy : ''
    };

    let transactionResponseModel: TransactionResponseModel;
    return this.purchaseService.issueNewPin(model).subscribe((res: TransactionResponseModel) => {
      // console.log("purchase new pin successfull", res);
      transactionResponseModel = res;
    },
      err => {
        let error = new ErrorDialogModel();
        error.header = 'Transaction Declined';
        error.message = 'Please check your information and try again.';
        this.ngZone.run(() => {
          this.openErrorDialog(error);
        });
      },
      () => {
        if (transactionResponseModel.Status) {
          this.navigateToConfirmationPage(transactionResponseModel.OrderId)
        } else {
          let error = new ErrorDialogModel();
          error.header = 'Transaction Declined';
          error.message = 'Please check your information and try again.'; //transactionResponseModel.ErrorMessages[0];
          this.ngZone.run(() => {
            this.openErrorDialog(error);
          });
        }
      });
  }

  navigateToConfirmationPage(orderId: string) {
    this.ngZone.run(() => {
       this.router.navigate(['checkout/confirmation', orderId]);
      //this.router.navigate(['account/confirmation', orderId]);
    });
  }
  navigateToConfirmationFreePage(orderId: string) {
    this.ngZone.run(() => {
      this.router.navigate(['checkout/freetrial_confirmation', orderId]);
    });
  }
}