import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
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
@Component({
  selector: 'app-mobile-notifications',
  templateUrl: './mobile-notifications.component.html',
  styleUrls: ['./mobile-notifications.component.scss']
})
export class MobileNotificationsComponent implements OnInit, OnDestroy {
  
	username: string;
  @Input() plan: Plan;
	 
	isEnableOtherPlan: boolean = false;
  is_notification: boolean=false;
  sendPushNotification: boolean=false;
  sendSMSPromo: boolean=false;
  uri:string='';
  myModel:boolean=true;
  isSmallScreen: boolean=false;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
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
    this.uri = 'notification';
	 


    

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
  this.router.navigate(['deals/buy1-get1'])
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
}
