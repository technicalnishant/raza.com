import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillingInfo } from '../../../accounts/models/billingInfo';
import { CustomerService } from '../../../accounts/services/customerService';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

@Component({
  selector: 'app-recharge-confirmation',
  templateUrl: './recharge-confirmation.component.html',
  styleUrls: ['./recharge-confirmation.component.scss']
})
export class RechargeConfirmationComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private razaLayoutService: RazaLayoutService,
  ) { }

  orderId: string;
  billingInfo: BillingInfo;
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.razaLayoutService.setFixedHeader(true);
    this.customerService.getCustomerBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
      }
    )

  }

  backToMyAccount(): void {
    this.router.navigateByUrl("/account")
  }

}
