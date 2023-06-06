import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurrentSetting } from '../models/current-setting';
import { RazaEnvironmentService } from '../services/razaEnvironment.service';
//import { isNullOrUndefined } from 'util';
import { isNullOrUndefined } from "../../shared/utilities";
import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';
import { AuthenticationService } from '../../core/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear: any;

  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  
  
  get contact1800Number(): string {
    let number = '1-(877) 463-4233';
    if (isNullOrUndefined(this.currentSetting)) {
      return number;
    }

    if (this.currentSetting.currentCountryId === 2) {
      number = '1-(800) 550-3501'
    }

    if (this.currentSetting.currentCountryId === 3) {
      number = '+44-(800) 041-8192'
    }

    return number;

  }

  constructor(
    private razaEnvService: RazaEnvironmentService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private razaSnackBarService: RazaSnackBarService,
    
  ) {
    this.currentYear = new Date().getFullYear();

  }

  ngOnInit() {
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
  }

  scrollToMobileApp() {
    window.scrollTo(1650, 1650);
  }
  
  redirectClick(obj)
  {
    if (this.authService.isAuthenticated()) {
		
       
        this.router.navigate([obj])
       //this.router.navigate(['account/overview'])
      }
      else
      {
      //this.router.navigate(['auth/sign-up']);
      this.dialog.open(LoginpopupComponent, {
     
        data: { slideIndex: obj }
      });
      }
  }


  openDialog()
  {
    this.razaSnackBarService.openSnackDialog('This is a test error');
  }


  ngAfterViewInit() {
    //var window: any;
    var url_arr = window.location.href.split("=");
      if( url_arr[1] =='livechat' )
      this.redirectClick('account')
      
     
  }
  goTomobileTopup()
  {
   localStorage.removeItem("topupCountry");
   localStorage.removeItem("topupPhone");
   localStorage.removeItem("topupCountryId");
   localStorage.removeItem("topupTrigger");
   this.router.navigateByUrl('mobiletopup');
   
  }
}
