import { Component, OnInit, Input } from '@angular/core';
import { ICheckoutModel, MobileTopupCheckoutModel } from '../../models/checkout-model';
import { userContext } from '../../../core/interfaces';

@Component({
  selector: 'app-mobile-topup-confirmation',
  templateUrl: './mobile-topup-confirmation.component.html',
  styleUrls: ['./mobile-topup-confirmation.component.scss']
})
export class MobileTopupConfirmationComponent implements OnInit {

  constructor(
  ) { }

  @Input() orderId: string;
  @Input() checkoutModel: MobileTopupCheckoutModel;
  @Input() userContext: userContext
  datetime: Date = new Date();

  ngOnInit() {

  }

}
