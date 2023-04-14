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
import { BreakpointObserver } from '@angular/cdk/layout'; 
@Component({
  selector: 'app-checkout-confirmation',
  templateUrl: './checkout-confirmation.component.html',
  styleUrls: ['./checkout-confirmation.component.scss']
})
export class CheckoutConfirmationComponent implements OnInit, OnDestroy {
  constructor(
    private titleService: Title,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private razaLayoutService: RazaLayoutService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  currentCartObs$: Subscription;
  checkoutModel: ICheckoutModel;
  orderId: string;
  userContext: userContext
  transResponse: TransactionResponseModel;
  stepper:boolean=true;
  isSmallScreen;
  ngOnInit() {

    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');

    this.titleService.setTitle('Payment successful');
    this.razaLayoutService.setFixedHeader(true);
    this.getCurrentCart();
    this.getTrnsaResponse();
    this.userContext = this.authService.getCurrentLoginUser();
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    
    
  }

 
   
  getCurrentCart() {
    this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      if (model === null) {
        this.router.navigate(['/']);
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
