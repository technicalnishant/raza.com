import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../models/plan';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { PlanService } from '../../services/planService';
import { NavigationEnd, Router } from '@angular/router';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { BillingInfo } from '../../models/billingInfo';
import { CustomerService } from '../../services/customerService';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-account-overview-plan-info',
  templateUrl: './account-overview-plan-info.component.html',
  styleUrls: ['./account-overview-plan-info.component.scss']
})
export class AccountOverviewPlanInfoComponent implements OnInit {

  @Input() plan: Plan;
  billingInfo: BillingInfo;
  currentPlanName : string="";
  isLoading : boolean = true;
  currentBalance : number =0;

  constructor(
    private planService: PlanService,
    private router: Router,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService
  ) {

  }

  ngOnInit() {
     
    //Loading All customer plans.
    this.loadBillingInfo();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
    
      if(event.url == '/account/overview'  )
      {
        this.isLoading = true;
        
      }
      else{
        this.isLoading = false;
      }
       
      
    });
  }
  
  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
         
        ;
        
 
      })
  }

  onClickRechargeButton() {
    this.isLoading = true;
    if (this.plan.IsAllowRecharge) {
      // this.router.navigate(['recharge', this.plan.PlanId]);  
       this.router.navigate(['account/overview']); 
    } else {
      this.isLoading = false;
      this.razaSnackBarService.openWarning('This discounted plan is already enrolled to auto-refill, we will recharge automatically on your billing cycle or when your balance falls below $2.')
    }
  }

}
