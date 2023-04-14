import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PlanService } from '../accounts/services/planService';
import { AuthenticationService } from '../core/services/auth.service';
import { Plan } from '../accounts/models/plan';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { Title } from '@angular/platform-browser';
import { RazaLayoutService } from '../core/services/raza-layout.service';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../shared/utilities";
import { Router } from '@angular/router';
import { SearchRatesService } from '../rates/searchrates.service';
import { CurrentSetting } from '../core/models/current-setting';
import { Subscription } from 'rxjs';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { SearchRate } from '../rates/model/searchRates';
import { GlobalCallComponent } from '../globalrates/global-call/global-call.component';
import { LoginpopupComponent } from '../core/loginpopup/loginpopup.component';
@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {
  username: string;
  plan: Plan;
  isSmallScreen;
  isEnableOtherPlan: boolean = false;
  isNewClient:boolean = false;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  searchRates: SearchRate[];
  searchRateslist: SearchRate[];
  bindSearchRates: SearchRate[];
  isAutoRefillEnable: boolean = false;
  isAuthenticated: boolean = false;
  constructor( 
    private router: Router,
  private authService: AuthenticationService,
  public dialog: MatDialog,
  private planService: PlanService,
  private razalayoutService: RazaLayoutService,
  private route: ActivatedRoute,
  private breakpointObserver: BreakpointObserver,
  private searchRatesService: SearchRatesService,
  private razaEnvService: RazaEnvironmentService,
  private titleService: Title) {

}

  ngOnInit() {
     
     

this.isAuthenticated = this.authService.isAuthenticated();

    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    }); 
    if(this.authService.isAuthenticated())
    {
        this.planService.getAllPlans().subscribe(
          (data: Plan[]) => {
            this.plan = data[0];
            this.isEnableOtherPlan = data.length > 1
          },
          (err: ApiErrorResponse) => {
            console.log(err)
            
            }
        ); 
      }
     this.getCountryRates();
  }
 getCountryRates(){
   var country = 1;
   if(this.isAuthenticated)
     country = this.currentSetting.currentCountryId ;
    
  this.searchRatesService.getSearchRates(country).subscribe(
    (data: SearchRate[]) => {
      this.searchRates = data;
     
    },
    (err: ApiErrorResponse) => console.log(err),
  );
 }


 viewRates(countryId) {
  if(this.currentSetting.currentCountryId == 3)
   {
 this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, countryId).subscribe(
   (data: any) => {
     if (this.dialog.openDialogs.length == 0) {
       this.dialog.open(GlobalCallComponent, {
         data: { data },
         width: '85vw',
         maxWidth: '1235px'
       });
     }
   },
   (err: ApiErrorResponse) => console.log(err));
  }
 else
 {       
   localStorage.setItem('rate_country_id', countryId);
   this.router.navigate(['globalcallrates']); 
 } 
}


clickRecharge(comp, redirect_path, plan)
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
      dialogConfig.data = 
      {
        name: "logout",
        title: "Are you sure you want to logout?",
        description: "Pretend this is a convincing argument on why you shouldn't logout :)",
        redirect_path:redirect_path,
        module:comp,
        plan_id:plan,
        actionButtonText: "Logout",
      }
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.dialog.open(LoginpopupComponent, dialogConfig);
    }
  }

}
