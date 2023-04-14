import { Component, OnInit } from '@angular/core';
import { PlanService } from '../../services/planService';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Title } from '@angular/platform-browser';
import { Rewards, RedeemedPoint, EarnedPoint } from '../../models/rewardpoints';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { Router } from '@angular/router';
import { Plan } from '../../models/plan';
import { EnrollRewardDialog } from '../../dialog/enroll-reward/enroll-reward.dialog';
import { MatDialog } from '@angular/material/dialog';
import { RechargeRewardService } from '../../../recharge/services/recharge-reward.Service';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";

import { BillingInfo } from '../../models/billingInfo';
import { CustomerService } from '../../services/customerService';

@Component({
  selector: 'app-account-rewards',
  templateUrl: './account-rewards.component.html',
  styleUrls: ['./account-rewards.component.scss']
})
export class AccountRewardsComponent implements OnInit {
  rewardTotal: number;
  referedFriends: Rewards[];
  redeemedPoints: RedeemedPoint[];
  allRewardPoints: EarnedPoint[];
  isAbleToRedeemFlag: boolean = false;
  plan: Plan;
  isenableEnroll: boolean = false;
  btnEnrollDisable = true;
  rechargeOptions: any;
  enrollPoints: number = 0;
  enrollAmount: number = 10;
  county_id:number = 0;
  county_name:any;
  billingInfo: BillingInfo;
  constructor(private planService: PlanService,
    private razalayoutService: RazaLayoutService,
    private router: Router,
    public dialog: MatDialog,
    private rechargeRewardService: RechargeRewardService,
    private titleService: Title,
	private customerService: CustomerService
	) {
    this.getRewardTotal();   //screen 1 -Reward
  }

  ngOnInit() {
    this.titleService.setTitle('Rewards');
    this.razalayoutService.setFixedHeader(true);
    this.getReferedFriends(); //screen 2 -Refer
    this.getRedeemedPoints(); //screen 3 -Redeemed

    this.getPlanDetails();
    this.getRechargeOptions();
	  this.loadBillingInfo();

    //localStorage.setItem("auto_action", "SubmitReward"); enrollNow()
    if(localStorage.getItem("auto_action") && localStorage.getItem("auto_action") == 'SubmitReward')
    {
      this.enrollNow();
      localStorage.removeItem("auto_action");
    }
  }

  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo 	= res;
		this.county_id 		= res.Address.Country.CountryId
		this.county_name 	= res.Address.Country.CountryName
      })
  }
  
  getRechargeOptions() {
    this.rechargeRewardService.getRechargeOptions().subscribe(
      (res: any) => {
        this.rechargeOptions = res;
        if (!isNullOrUndefined(res)) {
          this.isenableEnroll = !res.IsActive;
          if (res.Options && res.Options.length > 0) {
            this.isAbleToRedeemFlag = true;
            this.enrollPoints=res.Options[0].Points;
            //this.enrollAmount=res.Options[0].Amount;
            this.enrollAmount=10;
          }
        }
      },
      err => console.log(err));
  }

  getPlanDetails() {
    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
      },
      (err: ApiErrorResponse) => console.log(err)
    );
  }

  getRewardTotal() {
    this.planService.getRewardTotal().subscribe(
      (data: number) => {
        this.rewardTotal = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  getReferedFriends() {
    this.planService.getReferedFriends().subscribe(
      (data: Rewards[]) => {
        this.referedFriends = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  getRedeemedPoints() {
    this.planService.getPointsRedeemed().subscribe(
      (data: RedeemedPoint[]) => {
        this.redeemedPoints = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  getAllEarnedPoints() {
    this.planService.getAllEarnedPoints().subscribe((res: EarnedPoint[]) => {
      this.allRewardPoints = res;
    });
  }

  redeemNow() {
    this.router.navigateByUrl("recharge/reward/" + this.plan.PlanId);
  }

  onClickDetails(show: boolean) {
    if (show) {
      this.getAllEarnedPoints();
    } else {
      this.allRewardPoints = null;
    }
  }

  enrollNow() {
    
    this.enrollToRewardPoints();
    
    //const dialogRef =this.dialog.open(EnrollRewardDialog);
    // dialogRef.afterClosed().subscribe(result => {
    //  if(result){
    //    this.btnEnrollDisable=false;
    //   this.enrollToRewardPoints();
    //  }
    // });
  }

  enrollToRewardPoints() {
    this.rechargeRewardService.postRewardSignUp().subscribe(
      (data: any) => {
        console.log('aaa', data);
        this.dialog.open(EnrollRewardDialog);
         
       // this.getAllEarnedPoints();
       this.getRewardTotal(); //screen 1 -Refer
        this.getReferedFriends(); //screen 2 -Refer
        this.getRedeemedPoints(); //screen 3 -Redeemed

        this.getPlanDetails();
        this.getRechargeOptions();

        this.btnEnrollDisable=false;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

}
