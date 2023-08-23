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
import { CallUsComponent } from 'app/shared/dialog/call-us/call-us.component';

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

  totalPoints:number=0;
  totalBalance:number=0;
  totalEarned:number=0;
  totalRefrals:number=0;
  totalCompleted:number=0;
  totalRedemed:number=0;
  referedFriendsCompleted: Rewards[];
  referrerCode:any;
  reffralUrl:string="https://raza.com/ref/";
  reff_text : string = `Enjoy FREE International calls with Raza! When you sign up and make your first purchase using my link, we'll both receive $5 credits - absolutely free. Follow this link to get started now!`
  rewardInfo:any = [];
  itemsPerPage = 10; // Number of items to load per page
  currentPage = 1; // Current page
  showLoadMore:boolean = false;
  allItems:any;

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
    this.getCode()
    this.getAllEarnedPoints()
    //localStorage.setItem("auto_action", "SubmitReward"); enrollNow()
    if(localStorage.getItem("auto_action") && localStorage.getItem("auto_action") == 'SubmitReward')
    {
      this.enrollNow();
      localStorage.removeItem("auto_action");
    }
  }
  getCode()
  {
      let phone = localStorage.getItem("login_no");
       
        this.customerService.getReferrerCode(phone).subscribe((res:any) =>  {
        this.referrerCode =  res.ReferrerCode ;
        this.reffralUrl = this.reffralUrl+this.referrerCode;
        
        },
          err => {
           // this.razaSnackBarService.openError('There must be some issue while fetching reffral code.');
          }
        );
     
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
        this.totalRefrals = data.length;

        this.referedFriendsCompleted = data.filter(p =>{return p.Point > 0} )

        if(data[0])
        {
          data.map(p =>{
            if(p.Point > 0)
            {
              this.totalCompleted = this.totalCompleted+1;
            }
          })
           
        }
        
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  getRedeemedPoints() {
    this.planService.getPointsRedeemed().subscribe(
      (data: RedeemedPoint[]) => {
        this.redeemedPoints = data;
        data.map(p =>{
          if(p.PointUsed > 0)
          {
            this.totalRedemed = this.totalRedemed+p.PointUsed;
          }
        })
      },
      (err: ApiErrorResponse) => console.log(err),
    );
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
  
  getAllEarnedPoints() {
    this.planService.getAllEarnedPoints().subscribe((res: EarnedPoint[]) => {
      //this.allRewardPoints = res;
      this.allItems = res;
    this.loadItems();
    });
  }
  loadItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.showLoadMore = true;
    this.allRewardPoints = this.allItems.slice(startIndex, startIndex + this.itemsPerPage);
  }

  loadMore() {
    this.currentPage++;
    this.loadItems();
  }

  openContactUsDialog() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
  }
}
