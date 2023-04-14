import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CheckoutService } from '../../services/checkout.service';
import { ICheckoutModel } from '../../models/checkout-model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { userContext } from '../../../core/interfaces';
import { AuthenticationService } from '../../../core/services/auth.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { TransactionResponseModel } from '../../../payments/models/transaction-response.model';
import { PlanService } from '../../../accounts/services/planService';

@Component({
  selector: 'app-moto-confirmation',
  templateUrl: './moto-confirmation.component.html',
  styleUrls: ['./moto-confirmation.component.scss']
})
export class MotoConfirmationComponent implements OnInit, OnDestroy {
  constructor(
    private titleService: Title,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private razaLayoutService: RazaLayoutService,
    private planService: PlanService
    
  ) { }

  currentCartObs$: Subscription;
  checkoutModel: ICheckoutModel;
  orderId: string;
  userContext: userContext
  transResponse: TransactionResponseModel;

  accessNumber: string;

  ngOnInit() {
    this.titleService.setTitle('Payment successful');
    this.razaLayoutService.setFixedHeader(true);
    this.getCurrentCart();
    this.getTrnsaResponse();
    this.userContext = this.authService.getCurrentLoginUser();
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.getAccessNumber(this.orderId);
    
  }

 
    getAccessNumber(id: string) {
    this.planService.getAccessNumber(id).subscribe(res => {
      this.accessNumber = res[0];
    })
  }
  getCurrentCart() {
    this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      if (model === null) {
       // this.router.navigate(['/']);
      }
      // console.log(model);
      this.checkoutModel = model
    }, err => {
    }, () => {
      this.checkoutService.deleteCart();
    })
  }
  ngOnDestroy(): void {
    this.currentCartObs$.unsubscribe();
    this.checkoutService.clearTransResponse();
  }

  getTrnsaResponse() {
    this.checkoutService.getTransResponse().subscribe(res => {
      this.transResponse = res;
    });
  }
}

