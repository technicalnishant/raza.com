import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
//import { TextMaskModule } from 'angular2-text-mask';
import { AuthenticationService } from '../services/auth.service';
import { userContext } from '../interfaces';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { PlanService } from '../../accounts/services/planService';
import { Plan } from '../../accounts/models/plan';
import { isNullOrUndefined } from "../../shared/utilities";
import { map } from 'rxjs/operators';
import { Location } from '@angular/common';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';



@Component({
  selector: 'logintopdropmenu',
  templateUrl: './logintopdropmenu.component.html',
  styleUrls: ['./logintopdropmenu.component.scss']
})
export class LogintopdropmenuComponent implements OnInit, OnDestroy {
  @Output() valueChange = new EventEmitter();
  flag: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthenticationService,
    private router: Router,
    private planService: PlanService,
    private breakpointObserver: BreakpointObserver,
    public matDialog: MatDialog
  ) {

  }

  subscription$: Subscription;
  isAuthenticated: boolean = false;
  isAccountMenuDisplay: boolean = false;
  private user: userContext;
  private planSub$: Observable<Plan>

  get username() {
    if (isNullOrUndefined(this.user.username) || (this.user.username as string).length === 0) {
      return 'Welcome Back, User !';
    }
    return this.user.username;
  }

  ngOnInit() {

    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
      this.getCurrentLoginUser();
    }

    this.subscription$ = AuthenticationService.userLoggedInSuccessfully
      .subscribe(isLoggedIn => this.updateLogInUser(isLoggedIn));

    this.breakpointObserver.observe(
      [Breakpoints.Handset,
      Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait])
      .subscribe(res => {
        this.toggleMenuForAccount();
      })

    this.planSub$ = this.planService.getAllPlans().pipe(
      map(res => {
        return res[0];
      })
    );
    localStorage.removeItem('redirect_path')
    
     
  }


  openLoginPopup()
   {
     this.authService.loginPopup();
   }
   
  get myMethodFunc() {
    return this.myMethod.bind(this);
}

  myMethod() {
   
   //this.toggleMenuForAccount();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onClickLogOut() {
    this.authService.logout();
    location.reload();
    // this.router.navigateByUrl('');
  }

  getCurrentLoginUser() {
    this.user = this.authService.getCurrentLoginUser();
  }

  updateLogInUser(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.isAuthenticated = true;
      this.getCurrentLoginUser();
    } else {
      this.isAuthenticated = false;
    }
    this.toggleMenuForAccount();
  }

  toggleMenuForAccount() {
    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 868px)');
    this.isAccountMenuDisplay = isSmallScreen && this.isUserAuthenticated();
  }
  openModal() {
    localStorage.removeItem('redirect_path');
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
    const modalDialog = this.matDialog.open(LoginpopupComponent, dialogConfig);
  }
}
