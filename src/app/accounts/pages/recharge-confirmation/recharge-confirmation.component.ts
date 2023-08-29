import { Component, OnInit, Input } from '@angular/core';
import { BillingInfo } from '../../../accounts/models/billingInfo';
import { CustomerService } from '../../../accounts/services/customerService';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/auth.service';
import { userContext } from '../../../core/interfaces';
import { ICheckoutModel } from '../../../checkout/models/checkout-model';
import { PlanService } from 'app/accounts/services/planService';
import { TransactionType } from 'app/payments/models/transaction-request.model';
@Component({
  selector: 'app-recharge-confirmation',
  templateUrl: './recharge-confirmation.component.html',
  styleUrls: ['./recharge-confirmation.component.scss']
})
export class RechargeConfirmationComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    
  ) { }

  orderId: string = this.route.snapshot.paramMap.get('orderId');;
  @Input() message: string;
  @Input() userContext: userContext
  ngOnInit() {
  }

 
}