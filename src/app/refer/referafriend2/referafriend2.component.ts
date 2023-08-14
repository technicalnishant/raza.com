import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
//import { isNullOrUndefined } from 'util';
import { CustomerService } from '../../accounts/services/customerService';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { AuthenticationService } from '../../core/services/auth.service';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { Subscription } from 'rxjs';
import { isNullOrUndefined } from "../../shared/utilities";


import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
 

@Component({
  selector: 'app-referafriend2',
  templateUrl: './referafriend2.component.html',
  styleUrls: ['./referafriend2.component.scss']
})
export class Referafriend2Component implements OnInit {

  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  referFriendForm: FormGroup;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private fb: FormBuilder,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
     
  ) {
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Refer a friend post login');

    this.referFriendForm = this.fb.group({
      friend1: [],
      friend2: [],
      friend3: [],
      friend4: [],
      friend5: [],
    });
  }

  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  redirectToLogin() {
    //console.log(this.route);

    
    if (this.authService.isAuthenticated()) {
		
       
     // this.router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: '/refer-a-friend' } })
       this.router.navigate(['account/overview'])
      }
      else
      {
      //this.router.navigate(['auth/sign-up']);
      this.dialog.open(LoginpopupComponent, {
     
        data: { slideIndex: '' }
      });
      }
 
    
  }

  referEmails() {

    const formValue = this.referFriendForm.value;
    const emails: string[] = [];

    if (!isNullOrUndefined(formValue.friend1)) {
      emails.push(formValue.friend1)
    }

    if (!isNullOrUndefined(formValue.friend2)) {
      emails.push(formValue.friend2)
    }

    if (!isNullOrUndefined(formValue.friend3)) {
      emails.push(formValue.friend3)
    }

    if (!isNullOrUndefined(formValue.friend4)) {
      emails.push(formValue.friend4)
    }

    if (!isNullOrUndefined(formValue.friend5)) {
      emails.push(formValue.friend5)
    }

    if (emails.length > 0) 
    {
      this.customerService.referFriends(emails).subscribe(res => {
        this.razaSnackBarService.openSuccess('Successfull Invited your friends.');
        this.referFriendForm.reset();
      },
        err => {
          this.razaSnackBarService.openError('User already exists.');
        }
      );
    }


    

    // if (emails.length > 0) {
    //   this.customerService.referFriends(emails).subscribe(res => {
    //     this.razaSnackBarService.openSuccess('Successfull Invited your friends.');
    //     this.referFriendForm.reset();
    //   },
    //     err => {
    //       this.razaSnackBarService.openError('User already exists.');
    //     }
    //   );
    // }



    
  }




}
