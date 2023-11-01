import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Plan } from '../../accounts/models/plan';
import { AuthenticationService } from '../services/auth.service';
import { SideBarService } from './sidemenu.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';
import { RazaEnvironmentService } from '../services/razaEnvironment.service';
import { CurrentSetting } from '../models/current-setting';
import {  Observable, Subscription } from 'rxjs';
import { PlanService } from 'app/accounts/services/planService';
import { ApiErrorResponse } from '../models/ApiErrorResponse';
import { ErrorDialogComponent } from 'app/shared/dialog/error-dialog/error-dialog.component';
import { ConfirmPopupDialog } from 'app/accounts/dialog/confirm-popup/confirm-popup-dialog';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {
  isLoggedIn: boolean=false;
  isSmallScreen: boolean;
 // plan: Plan;
 plan:any
  isDisplayAccountMenu: boolean;
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  isAuthenticatedn:boolean=false;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
    private sideBarNavService: SideBarService,
	private razaEnvService: RazaEnvironmentService,
  private planService: PlanService,
  ) { 

    this.authService.getSharedValue().subscribe(value => {
      this.isAuthenticatedn = value;
      if(this.isAuthenticatedn)
      {
        
        
      }
    });

  }
 
  ngOnInit() {
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.sideBarNavService.toggle();
      }
    })
	
	this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      
    })
    

    if(this.isAuthenticatedn){
      this.isLoggedIn = true;
        // this.planService.getAllPlans().subscribe(
        //   (data: Plan[]) => {
        //     this.plan = data[0];
        //     console.log("Hello you are",this.plan)
        //   } 
        // ); 

       // this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
         this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
          (res:any)=>{
            
            this.plan = res;
            
          }
        );
      }

  }

  get IsEnableLoggedIn(): boolean {
		if (!this.authService.isAuthenticated()) {
		  return false;
		}
    else
    {
      //  this.planService.getStoredPlan(localStorage.getItem("login_no")).subscribe(
      //   (res:any)=>{
          
      //     this.plan = res;
          
      //   }
      // );
      

      const planObservable =this.planService.getStoredPlan(localStorage.getItem("login_no"));
      if (planObservable) {
        planObservable.subscribe(
          (data) => {
            this.plan = data;
          },
          (error) => {
           // console.error('Error:', error);

            this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe( 
              (res:any)=>{
                
                this.plan = res;
                
              }
            );

          }
        );
      } else {
        console.error('The plan observable is null.');
        // Handle the case where the observable is null
      }
      return true;
    }
    
  }

  log_out_click(card) {
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        message:'Are your sure?',
        success: 'success'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == "success") {
        this.authService.logout()
              this.router.navigate(['/']);
      }
    });
  }
  redirectQuickClick = () =>{
    if(this.authService.isAuthenticated())
    {
     // this.planService.getAllPlans().subscribe(
       this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe(  
        //  this.planService.getStoredPlan(localStorage.getItem("login_no")).subscribe( 
        (data) => {
         // this.plan = data[0];
          this.plan = data;
         
         if (this.plan.IsAllowRecharge) {
     
          this.router.navigate(['recharge', this.plan.PlanId]);
          }
          else{
            this.router.navigate(['/account/overview']);
          }
        }  ,
        (err: ApiErrorResponse) => {
          let error={message:err.error.Message} 
          this.authService.logout()
          this.dialog.open(ErrorDialogComponent, {
            data: { error }
          });
        }
      ); 
      
    }
    else{
      this.router.navigate(['/recharge/quick']);
    }
     
  }
  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  clickRecharge()
  {
    if(this.authService.isAuthenticated())
    {
      this.router.navigate(['/account/overview']);
    }
    else
    {
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      dialogConfig.data = {
        name: "logout",
        title: "Are you sure you want to logout?",
        description: "Pretend this is a convincing argument on why you shouldn't logout :)",
        actionButtonText: "Logout",
      }
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
    }
  }
  
  redirectClick()
  { 
      if(this.authService.isAuthenticated())
      {
        this.router.navigate(['account/overview'])
      }
      else
      {
      this.dialog.open(LoginpopupComponent, {
     
        data: { slideIndex: '' }
      });
      }
      
  }

}
