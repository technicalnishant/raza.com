import { Component, OnInit, Input } from '@angular/core';
import { BillingInfo } from '../../../accounts/models/billingInfo';
import { CustomerService } from '../../../accounts/services/customerService';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';
import { userContext } from '../../../core/interfaces';
import { ICheckoutModel } from '../../models/checkout-model';

@Component({
  selector: 'app-recharge-confirmation',
  templateUrl: './recharge-confirmation.component.html',
  styleUrls: ['./recharge-confirmation.component.scss']
})
export class RechargeConfirmationComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  @Input() orderId: string;
  @Input() message: string;
  @Input() userContext: userContext
  ngOnInit() {
  }

  backToMyAccount(): void {
    this.router.navigateByUrl("/account")
  }
}
