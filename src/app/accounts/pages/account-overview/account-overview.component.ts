import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlanService } from '../../services/planService';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Plan } from '../../models/plan';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Title } from '@angular/platform-browser';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";
import { Router } from '@angular/router';
import { ErrorDialogComponent } from 'app/shared/dialog/error-dialog/error-dialog.component';
@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss']
})

export class AccountOverviewComponent implements OnInit, OnDestroy {
  username: string;
  plan: Plan;
  isSmallScreen;
  isEnableOtherPlan: boolean = false;
  isNewClient:boolean = false;
  showBuyNow:boolean = false;
  public innerWidth: any;
  showMobileStats:boolean=false
  showPlan:boolean=false;
  newDesign:boolean=false;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private planService: PlanService,
    private razalayoutService: RazaLayoutService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private titleService: Title) {
      console.log(this.router.url);
  }

  ngOnInit() {
    this.razalayoutService.setFixedHeader(true);
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
    //Loading All customer plans.
    this.titleService.setTitle('Overview');
    this.username = this.authService.getCurrentLoginUserName();
    if(this.router.url == '/account/overview') 
    {
      this.newDesign = true;
    }
    this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
      //this.planService.getStoredPlan(localStorage.getItem("login_no")).subscribe( 
      (res:any)=>{
         
        this.plan = res;
        localStorage.setItem('currentPlan',JSON.stringify(this.plan));
  
      },
      (err: ApiErrorResponse) => {
        if(localStorage.getItem("login_with") == 'phone')
        {
         // let error={message:err.error.Message}
          let error={message:'To access your account, it is essential to set up a  phone number for verification. Please call customer service for help.'}
          this.authService.logout()
          this.router.navigate(['/']);
          this.dialog.open(ErrorDialogComponent, {
              data: { error }
           });
        }
        else{
          this.getAllPlans();
        }
        // let error={message:err.error.Message} 
        //  this.authService.logout()
        //  this.router.navigate(['/']);
        // this.dialog.open(ErrorDialogComponent, {
        //   data: { error }
        // });
         
        }
    )
   
      
	 

    
	
    this.innerWidth = window.innerWidth;
    this.getMobileStats();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.getMobileStats();
  }

  getAllPlans()
  {
    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {

            if(!data[0])
            {
              this.authService.logout()
              this.router.navigate(['/']);
            }
            else
            {
                if(this.plan)
                {

                }
                else{
                  this.plan = data[0];
                  
                  localStorage.setItem('currentPlan',JSON.stringify(this.plan))
                }
                //
                this.isEnableOtherPlan = data.length > 1;
                if(data.length >= 1)
                {
                  this.showBuyNow = false;
                }
                else
                this.showBuyNow = true;
          }
      },
      (err: ApiErrorResponse) => {
        console.log(err)
        this.showBuyNow = true;
         
        }
    ); 
  }
  getMobileStats = () =>{
    if(this.innerWidth <= 780)
    {
       this.showMobileStats = true;
    }
    else{
      this.showMobileStats = false;
    }
    console.log(this.innerWidth);
  }
  ngOnDestroy() {
    this.newDesign = false;
  }
	 
  get userWelcomeLabel() {
    if (isNullOrUndefined(this.username) || (this.username as string).length === 0) {
      return 'Welcome Back,';
    }
    return `Hello, ${this.username}`
  }

  showPlanDetails=()=>{
    this.showPlan=true;
  }

  onPaymentInfoFormSubmit(event){
    
  }
}
