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
import { Plan } from '../../../accounts/models/plan';
import { PlanService } from '../../../accounts/services/planService';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
@Component({
  selector: 'app-freetrial-confirmation',
  templateUrl: './freetrial-confirmation.component.html',
  styleUrls: ['./freetrial-confirmation.component.scss']
})
export class FreetrialConfirmationComponent implements OnInit, OnDestroy {
  constructor(
    private titleService: Title,
    private checkoutService: CheckoutService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router,
    private razaLayoutService: RazaLayoutService,
    private planService: PlanService,
    
  ) { }

  currentCartObs$: Subscription;
  checkoutModel: ICheckoutModel;
  orderId: string;
  plan: Plan;
  accessNo:any;
  userContext: userContext
  transResponse: TransactionResponseModel;
  freetrialAmount:any;
  freetrialMinutes:any;
  ngOnInit() {
    this.titleService.setTitle('Payment successful');
    this.razaLayoutService.setFixedHeader(true);
    this.getCurrentCart();
    this.getTrnsaResponse();
    this.getPlanInfo();
    this.userContext = this.authService.getCurrentLoginUser();
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    
    
  }

 
   
  getCurrentCart() {
    this.currentCartObs$ = this.checkoutService.getCurrentCart().subscribe((model: ICheckoutModel) => {
      if (model === null) {
        //this.router.navigate(['/']);
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
getPlanInfo()
{
  var phone = localStorage.getItem("login_no");
 this.planService.getPlanInfo(phone).subscribe( 
   // this.planService.getStoredPlan(phone).subscribe( 
    (res:any)=>{
      console.log(res);
     const from_country = res.CountryFrom;
     const to_country =  res.CountryTo;
      this.planService.getFreeTrialInfo(from_country, to_country).subscribe( (data:any)=>{
        this.freetrialAmount = data.Amount;
        this.freetrialMinutes = data.TotalMinutes; 
      })
      this.planService.getAllPlans().subscribe(
        (data: Plan[]) => {
          this.plan = data[0];
          this.accessNo = this.plan.AccessNumbers[0];
        },
        (err: ApiErrorResponse) => {
          console.log(err)
           
          }
      );
    }
  );
}
}

