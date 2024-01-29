import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { PlanService } from '../../services/planService';
 
import { Plan } from '../../models/plan';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
 
 
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../../shared/utilities";
import { elementAt } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/services/auth.service';
import { Buy1get1Component } from 'app/core/dialog/buy1get1/buy1get1.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 
@Component({
  selector: 'app-account-options',
  templateUrl: './account-options.component.html',
  styleUrls: ['./account-options.component.scss']
})
export class AccountOptionsComponent implements OnInit, OnDestroy {
  
	username: string;
	plan: Plan;
	 
	isEnableOtherPlan: boolean = false;
  is_notification: boolean=false;
  sendPushNotification: boolean=false;
  sendSMSPromo: boolean=false;
  uri:string='';
  myModel:boolean=true;
  isSmallScreen: boolean=false;
  showPlan: boolean;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private razalayoutService: RazaLayoutService,
	private planService: PlanService,
	private authService: AuthenticationService,
  private breakpointObserver: BreakpointObserver,
  ) 
  { 
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
  }
  @ViewChild("toggleElement") ref: ElementRef;
  ngOnInit() {
   
    this.titleService.setTitle('Recharge');
    this.razalayoutService.setFixedHeader(true);
    this.uri = this.route.snapshot.paramMap.get('notification');//?this.route.snapshot.paramMap.get('notification'):'notification';
	this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
        if(data.length > 0 )
        {
          this.isEnableOtherPlan =false
        }
        else {
			if( this.authService.isNewUser() == true)
			{
				this.isEnableOtherPlan =true;
			}
        }
         this.getNotiStatus();
      },
      (err: ApiErrorResponse) => console.log(err)
    );


    

  }
  getNotiStatus()
  {
    if(this.plan)
    {

    
    this.planService.getNotificationStatus(this.plan.CustomerId, this.plan.PlanId ).subscribe(
      (data: any) => {
       console.log(data);
       this.sendPushNotification = data.SendPushNotification;
       
       this.sendSMSPromo = data.SendSMSPromo;
      },
      (err: ApiErrorResponse) => console.log(err)
    );
  }
  }
 ngOnDestroy() {

  }
  onClickTopUpBtn(): void {
    this.router.navigate(['mobiletopup'])
  }
  onClickBuyGet():void{
  //this.router.navigate(['deals/buy1-get1'])

  const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.panelClass = "tryUsFree";
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    dialogConfig.data = {
      name: "buy1get1",
      title: "Buy1 Get1", 
    }
    const modalDialog = this.dialog.open(Buy1get1Component, dialogConfig);
  }
  keepIt1(e){
    //this.myModel = true;

    const someCondition = true;
    if (someCondition) {
      this.myModel = true;
    }

  }
  keepIt(d){
    this.sendSMSPromo;
    this.sendPushNotification;
    var body = {
      "CustomerId": this.plan.CustomerId,
      "PhoneNumber": this.plan.Pin,
      "SendSMSPromo": this.sendSMSPromo,
      "SendPushNotification": this.sendPushNotification
    }
    this.planService.setNotificationStatus( body).subscribe(
      (data: any) => {
       console.log(data);
        
      },
      (err: ApiErrorResponse) => console.log(err)
    );
    
 }

 showPlanDetails=()=>{
  this.showPlan=!this.showPlan;
}
hidePlanDetail = () => {

   
}


}
