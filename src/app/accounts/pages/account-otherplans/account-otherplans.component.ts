import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PlanService } from '../../services/planService';
import { CountriesService } from '../../../core/services/country.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Plan } from '../../models/plan';
import { AllAccessNumbersDialog } from '../../dialog/all-access-numbers/all-access-numbers.dialog';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { CurrentSetting } from 'app/core/models/current-setting';
import { Subscription } from 'rxjs';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';

@Component({
  selector: 'app-account-otherplans',
  templateUrl: './account-otherplans.component.html',
  styleUrls: ['./account-otherplans.component.scss']
})
export class AccountOtherplansComponent implements OnInit {
  @Input() plan: Plan;
  username: string;
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  constructor(public dialog: MatDialog,
    private planService: PlanService,
    private titleService: Title,
    private countriesService: CountriesService,
    private razaLayoutService: RazaLayoutService,
    private razaSnackBarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Other Plans');
    this.razaLayoutService.setFixedHeader(true);
     this.razaEnvService.getCurrentSetting().subscribe(res => {
      
      this.currentSetting = res;

      
    })
    this.getAllPlan();
  }

  showAllAccessNumbers(accessNumbers: string[]) {
    this.dialog.open(AllAccessNumbersDialog, {
      data: {
        accessNumbers: accessNumbers
      }
    });
  }

  getAllPlan() {
    this.planService.getAllPlans().subscribe(
      (data: any) => {
        this.plan = data;
      },
      (err: ApiErrorResponse) => console.log(err)
    );
  }
  /*
  if (this.plan.IsAllowRecharge) {
    this.router.navigate(['recharge', this.plan.PlanId]);
  } else {
    this.razaSnackBarService.openWarning('This discounted plan is already enrolled to auto-refill, we will recharge automatically on your billing cycle or when your balance falls below $2.')
  }*/
  rechargeMsg()
  {
    this.razaSnackBarService.openWarning('This discounted plan is already enrolled to auto-refill, we will recharge automatically on your billing cycle or when your balance falls below $2. \n \n Please call customer service for help.')
  }
  recharge(instanceId) {
    //this.router.navigateByUrl("recharge/" + instanceId);
    localStorage.setItem('orderId', instanceId);
     this.router.navigateByUrl("/account/recharge/"+ instanceId );
  }

  pinlessSetup(instanceId) {
    this.router.navigate(['account/other-plans/my-numbers', instanceId]);
  }

  oneTouchDial(instanceId) {
    this.router.navigate(['account/other-plans/onetouchSetups', instanceId]);
  }

  callDetails(instanceId) {
    this.router.navigate(['account/other-plans/call-details', instanceId]);
  }

  callForwarding(instanceId) {
    this.router.navigate(['account/other-plans/callForwardingSetups', instanceId]);
  }

  autoRefill(instanceId) {
    this.router.navigate(['account/other-plans/autorefill', instanceId]);
  }

}
