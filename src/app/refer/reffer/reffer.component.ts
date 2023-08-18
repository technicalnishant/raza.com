import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BillingInfo } from 'app/accounts/models/billingInfo';
import { Plan } from 'app/accounts/models/plan';
import { EarnedPoint, RedeemedPoint, Rewards } from 'app/accounts/models/rewardpoints';
import { CustomerService } from 'app/accounts/services/customerService';
import { MetaTagsService } from 'app/core/services/meta.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { RechargeRewardService } from 'app/recharge/services/recharge-reward.Service';
import { RazaSnackBarService } from 'app/shared/razaSnackbar.service';
import { isNullOrUndefined } from '../../shared/utilities'
import { PlanService } from 'app/accounts/services/planService';
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { AuthenticationService } from 'app/core/services/auth.service';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-reffer',
  templateUrl: './reffer.component.html',
  styleUrls: ['./reffer.component.scss']
})
export class RefferComponent implements OnInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('tabContainer') tabContainer: ElementRef; // Add this line
  
  mode = new FormControl('over');
  headerValue: number = 1;
  referrerCode:any;
  reffralUrl:string="https://raza.com/ref/";
  reff_text : string = `Enjoy FREE International calls with Raza! When you sign up and make your first purchase using my link, we'll both receive $5 credits - absolutely free. Follow this link to get started now!`
  rewardInfo:any = [];
  
  totalPoints:number=0;
  totalBalance:number=0;
  totalEarned:number=0;
  totalRefrals:number=0;
  totalCompleted:number=0;
  totalRedemed:number=0;
  
  userLoggedin:boolean=false;
  rewardTotal: number;
  referedFriends: Rewards[];
  referedFriendsCompleted: Rewards[];
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
  
  constructor(
    private router: Router, 
    private titleService: Title, 
    private metaTagsService:MetaTagsService,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    private rechargeRewardService: RechargeRewardService,
    private planService: PlanService,
    private authService: AuthenticationService,
    ) { 
      
    }

  ngOnInit() {
    this.titleService.setTitle('Refer a friend'); 
    this.metaTagsService.getMetaTagsData('refer-a-friend');
    if(this.authService.isAuthenticated())
    {
      this.getRewardTotal();
      this.userLoggedin = true;
      this.getCode();
    

      this.getReferedFriends(); //screen 2 -Refer
      this.getRedeemedPoints(); //screen 3 -Redeemed
  
      this.getPlanDetails();
      this.getRechargeOptions();
      this.getAllEarnedPoints();
    }
    else
    {
      this.userLoggedin = false;
    }
    

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
   // this.planService.getAllPlans().subscribe(
   this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe(
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

  getAllEarnedPoints() {
    this.planService.getAllEarnedPoints().subscribe((res: EarnedPoint[]) => {
      this.allRewardPoints = res;
    });
  }
  getCode()
  {
      let phone = localStorage.getItem("login_no");
       
        this.customerService.getReferrerCode(phone).subscribe((res:any) =>  {
        this.referrerCode =  res.ReferrerCode ;
        this.reffralUrl = this.reffralUrl+this.referrerCode;
        
        },
          err => {
            this.razaSnackBarService.openError('There must be some issue while fetching reffral code.');
          }
        );
     
  }
  shareinstaUrl() {
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content' + encodeURIComponent("Custom Title") + ':%20 ' + encodeURIComponent(this.reffralUrl));
    return false;
  }

  redeemNow() {
    this.router.navigateByUrl("recharge/reward/" + this.plan.PlanId);
  }
  selectTab(index: number) {
    this.tabGroup.selectedIndex = index;

    if (this.tabContainer && this.tabContainer.nativeElement) {
      this.tabContainer.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    
  }
}

