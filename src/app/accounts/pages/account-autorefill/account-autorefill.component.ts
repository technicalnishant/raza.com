import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';

import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';

import { AddEnrollDialog } from '../../dialog/add-enroll-dialog/add-enroll-dialog';
import { ConfirmPopupDialog } from '../../dialog/confirm-popup/confirm-popup-dialog';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { AutoRefill, AutoRefillStatus } from '../../models/autorefill';
import { CurrentSetting } from '../../../core/models/current-setting';
import { CreditCard } from '../../models/creditCard';
import { PlanService } from '../../services/planService';
import { AuthenticationService } from '../../../core/services/auth.service';
import { Plan } from '../../models/plan';
import { AddCreditcardDialog } from '../../dialog/add-creditcard-dialog/add-creditcard-dialog';
import { isNullOrUndefined } from "../../../shared/utilities";
 
@Component({
  selector: 'app-account-autorefill',
  templateUrl: './account-autorefill.component.html',
  styleUrls: ['./account-autorefill.component.scss']
})
export class AccountAutorefillComponent implements OnInit, OnDestroy {
  creditCards: CreditCard[]=[]; cardCount: number;   billingInfo: any;
  planId: string;
  isMobileDevice: boolean = false;
  autorefill: AutoRefill;
  flagAutoDisable = false;
  flagAuto = true;
  flagUnDisable = false;
  flagUn = false;
  planPin : string;

  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;

  plan: Plan;
  isSmallScreen;
  isEnableOtherPlan: boolean = false;
  isNewClient:boolean = false;
  action:string='';
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private razaSnackbarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    private razalayoutService: RazaLayoutService,
    private planService: PlanService,
    private authService: AuthenticationService,
    private titleService: Title) {
    this.planId = this.route.snapshot.paramMap.get('planId'); 
    
  }

  ngOnInit() {
    this.titleService.setTitle('Auto Refill');
    this.razalayoutService.setFixedHeader(true);
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });

    this.route.queryParams
    .subscribe(params => {
      this.action =params.action;
       
    }
  );
  if(localStorage.getItem("login_no") && localStorage.getItem("login_no") !='')
  {
   // let phone = this.authService.getCurrentUserPhone();
    let phone = localStorage.getItem("login_no");
    this.planService.getPlanByPinlessNumber(phone).subscribe(
     // this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe(
      (data: Plan) => {
        this.plan = data;
        this.planId = this.plan.PlanId
        this.isEnableOtherPlan = true;
        
        this.getAutoEnroll();
        this.creditCardsData();
       },
      (err: ApiErrorResponse) => {
        
        
        }
    );

  }
     else{
    this.planService.getAllPlans().subscribe(
      (data: Plan[]) => {
        this.plan = data[0];
        this.planId = this.plan.PlanId
        this.isEnableOtherPlan = data.length > 1;
        this.getAutoEnroll();
        this.creditCardsData();
       
      },
      (err: ApiErrorResponse) => {
        console.log(err)
         
        }
    );  
      }
    
   
   
  }

  
  creditCardsData(){
    this.customerService.getSavedCreditCards().subscribe(
      (data: CreditCard[]) => {
        this.creditCards = data;
        this.cardCount = data.length;
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }
  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { 
        this.billingInfo = res; 
       // console.log("your action is here "+this.action);
        if(this.action =='trigger_click')
        {
          /// this.openAutoRefillSetupDialog(this.autorefill, true);

          var userInfo = this.authService.getCurrentLoginUser();
          console.log(userInfo);
           const dialogRefCard = this.dialog.open(AddEnrollDialog, {
            data: {
              planId: this.planId,
             // planId: this.plan.Pin,
              header:'promotion',
              username:userInfo.username,
              pin: this.plan.Pin,
              autorefillSetup: this.autorefill,
              isEdit: true,
            },
            panelClass:'auto-refill-class'
          });
      
          dialogRefCard.afterClosed().subscribe(result => {
            if (result == "success") {
              this.getAutoEnroll();
            }
          },
            err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
          )


          //this.addEnroll();
        }

      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  getAutoEnroll() {
    if (!isNullOrUndefined(this.planId)) {
    this.customerService.getAutoRefill(this.planId).subscribe(
      (data: AutoRefill) => {
        this.autorefill = data;
        this.loadBillingInfo();
         console.log('this.autorefill',this.autorefill);
      },
      (err: ApiErrorResponse) => console.log(err),
    );
    }
  }

  isEnableSubscribeButton(): boolean {
    if (this.autorefill.Status !== null) {
      switch (this.autorefill.Status) {
        case AutoRefillStatus.Active:
          return false;
          break;
        case AutoRefillStatus.Blocked:
          return false;
          break;
        case AutoRefillStatus.Inactive:
          return true;
          break;
        case AutoRefillStatus.Pending:
          return false;
          break;
        case AutoRefillStatus.Unsubscribed:
          return true;
          break;
        case AutoRefillStatus.PendingUnSubscribe:
          return false;
          break;
        default:
          return true;
          break;
      }
    }
    return true;
  }

  isDisplayAutorefillInfo() {
    if (this.autorefill.Status !== null) {
      switch (this.autorefill.Status) {
        case AutoRefillStatus.Active:
          return true;
          break;
        case AutoRefillStatus.Blocked:
          return false;
          break;
        case AutoRefillStatus.Inactive:
          return true;
          break;
        case AutoRefillStatus.Pending:
          return true;
          break;
        case AutoRefillStatus.Unsubscribed:
          return false;
          break;
        case AutoRefillStatus.PendingUnSubscribe:
          return true;
          break;
        default:
          return false;
          break;
      }
    }
    return false
  }

  isAutorefillActive() {
    return this.autorefill.Status === AutoRefillStatus.Active;
  }

  getAutorefillStatusText() {
    if (this.autorefill.Status !== null) {
      switch (this.autorefill.Status) {
        case AutoRefillStatus.Active:
          return 'Enabled';
        case AutoRefillStatus.Blocked:
          return 'Blocked';
        case AutoRefillStatus.Inactive:
          return 'InActive';
        case AutoRefillStatus.Pending:
          return 'Pending';
        case AutoRefillStatus.PendingUnSubscribe:
          return 'Pending UnSubscribe';
        case AutoRefillStatus.Unsubscribed:
        default:
          return '';
      }
      return '';
    }
  }

  addEnroll() {
    if(this.cardCount==0)
    this.cardBillingAddress(null);
    else
    this.openAutoRefillSetupDialog(null, false);
  }

  cardBillingAddress(data) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: data,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
      if (result == "success") {
        //this.loadBillingInfo();
        this.customerService.getSavedCreditCards().subscribe(
          (data: CreditCard[]) => { 
            this.cardCount = data.length; 
            if(this.cardCount>0)
            this.openAutoRefillSetupDialog(null, false);
          },
          (err: ApiErrorResponse) => console.log(err),
        )
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

  editAutoRefill(autorefill: any) {
    this.openAutoRefillSetupDialog(this.autorefill, true);
  }

  openAutoRefillSetupDialog(autorefillSetup: AutoRefill, isEdit: boolean) {
    console.log("Plan Id", this.planId);
    console.log("pin", this.plan.Pin);
    console.log("autorefillSetup", this.autorefill);
   

    const dialogRefCard = this.dialog.open(AddEnrollDialog, {
      data: {
        planId: this.planId,
       // planId: this.plan.Pin,
        pin: this.plan.Pin,
        autorefillSetup: this.autorefill,
        isEdit: true
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
      if (result == "success") {
        this.getAutoEnroll();
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

  deleteAutoRefill() {
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        success: 'success',
        message:'Are you sure?',
        heading:'Delete autorefill'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "success") {
        this.customerService.deleteAutoRefill(this.planId).subscribe(
          (res: any) => {
            if (res) {
              this.razaSnackbarService.openSuccess("Auto Refill set up deleted successfully.");
              this.getAutoEnroll();
            }
            else
              this.razaSnackbarService.openError("Unable to delete information, Please try again.");
          },
          err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
        )
      }
    });
  }

 
}
