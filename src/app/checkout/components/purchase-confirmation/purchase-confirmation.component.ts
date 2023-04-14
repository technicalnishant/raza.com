import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CheckoutService } from '../../services/checkout.service';
import { Title } from '@angular/platform-browser';
import { TransactionRequest, TransactionType } from '../../../payments/models/transaction-request.model';
import { ActivatedRoute } from '@angular/router';
import { ICheckoutModel } from '../../models/checkout-model';
import { userContext } from '../../../core/interfaces';
import { Subscription } from 'rxjs';
import { PlanService } from '../../../accounts/services/planService';

@Component({
  selector: 'app-purchase-confirmation',
  templateUrl: './purchase-confirmation.component.html',
  styleUrls: ['./purchase-confirmation.component.scss']
})
export class PurchaseConfirmationComponent implements OnInit {
  constructor(
    private planService: PlanService
  ) { }

  @Input() orderId: string;
  @Input() checkoutModel: ICheckoutModel;
  @Input() userContext: userContext
  datetime: Date = new Date();

  accessNumber: string;

  ngOnInit() {
    if (this.checkoutModel.transactiontype === TransactionType.Sale || this.checkoutModel.transactiontype === TransactionType.Activation) {
      this.getAccessNumber(this.orderId);
    }
  }

  getAccessNumber(id: string) {
    this.planService.getAccessNumber(id).subscribe(res => {
      this.accessNumber = res[0];
    })
  }
}
