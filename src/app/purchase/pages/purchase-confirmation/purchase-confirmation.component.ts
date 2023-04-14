import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TransactionRequest } from '../../../payments/models/transaction-request.model';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.component.html',
  styleUrls: ['./purchase-confirmation.component.css']
})
export class PurchaseConfirmationComponent implements OnInit {

  constructor(private titleService: Title) { }

  orderNo: string;
  email: string;
  purchaseAmount: number;
  transactionReq: TransactionRequest;
  serviceFee: number;
  datetime: Date;
  ngOnInit() {
    this.titleService.setTitle('Payment successful');
    PurchaseService.processedTransaction.subscribe(a => {
      this.transactionReq = a;
    }, err => {
    }, () => {
      this.orderNo = this.transactionReq.Order.OrderDetails.OrderNumber;
      this.email = this.transactionReq.Order.Consumer.Email1;
      this.purchaseAmount = this.transactionReq.Order.OrderDetails.Amount;
      this.serviceFee = this.transactionReq.checkoutOrderInfo.checkoutCart.calculateServiceFee();
      this.datetime = new Date();
    })
  }

  /* Calculate service fee*/
  calculateServiceFee(serviceChargePercent: number, purchaseAmount: number): number {
    return serviceChargePercent * purchaseAmount / 100;
  }

  totalAmount() {
    return this.purchaseAmount + this.serviceFee;
  }
}
