import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedbackService } from 'app/feedback/feedback.service';
import { Router, NavigationEnd, RoutesRecognized   } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import {FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective} from '@angular/forms';

import { AuthenticationService } from 'app/core/services/auth.service';
import { userContext } from 'app/core/interfaces';
import { CustomerService } from 'app/accounts/services/customerService';
import { BillingInfo } from 'app/accounts/models/billingInfo';
import { PlanService } from 'app/accounts/services/planService';
 
 
export interface ticketData  
{
  "EmailAddress": string;
  "PhoneNumber": string;
  "Pin": string;
  "IssueType": string;
  "Description": string;
  "Notes": string;
  
}


@Component({
  selector: 'app-reportanissue-dialog',
  templateUrl: './reportanissue-dialog.component.html',
  styleUrls: ['./reportanissue-dialog.component.scss']
})
export class ReportanissueDialogComponent implements OnInit {
  billingInfo: BillingInfo;
  message: string;
  closable: boolean;
  type: string;
  feedbackList:any
  feedbacklistServer:any
  ticketField:  ticketData
  private previousUrl: string = undefined;
  private currentUrl: string = undefined;
  feedbackForm: FormGroup;
  userContext:userContext;
  ticketResponse:string;
  ticketSubmitted:boolean=false;
  //constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ReportanissueDialogComponent>,
  private quickLinksService: FeedbackService,
  private router: Router,
  private formBuilder: FormBuilder,
  private authService: AuthenticationService,
  private customerService: CustomerService,
  private planService: PlanService,
    ) { 

      this.feedbackList = {
        0:'About our new website', 
        1:'Feedback &amp; Suggestions',
        2: "I am unable to Login",
        3: "I am unable to Recharge",
        4: "Remove Numbers from PinLess SetUp",
        5: "The above access number is not working",
        6: "I want to Cancel My Auto Refill",
        7: "My card is not recharged yet",
        8: "I was Charged by PAYPAL but order could not be processed",
        9: "Other Description"
      }

    }
    
  ngOnInit() {

    if (!this.authService.isAuthenticated()) {
		  
      this.close();
		}
    this.userContext = this.authService.getCurrentLoginUser();
    this.createFeedBackForm();
 
    this.router.events
    .pipe(filter((e: any) => e instanceof RoutesRecognized),
      pairwise()
    ).subscribe((e: any) => {
      this.previousUrl = e[0].urlAfterRedirects; // previous url
      console.log('this.previousUrl ' +this.previousUrl);
    });

    this.getFeedBackTypes()
   this.loadBillingInfo()
  }

  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
        this.feedbackForm.controls['email'].setValue(this.billingInfo.Email);
        this.feedbackForm.controls['phoneNumber'].setValue( localStorage.getItem("login_no"));
        this.setSelected();
        //  this.planService.getPlanInfo(localStorage.getItem("login_no")).subscribe(
        //    (res:any)=>{
        //      console.log(res);
            
        //    }
        //  );
          
        

      })
  }
createFeedBackForm(){
  this.feedbackForm = this.formBuilder.group({
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [Validators.required,Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
    typeOfFeedback: new FormControl('', Validators.required),
    yourFeedback: new FormControl('', Validators.required)
  });
}

  public getFeedBackTypes(){

    this.quickLinksService.getFeedBackTypes().subscribe((res:any) => {
      if(res[0])
      {
        this.feedbacklistServer = res;
      }
      else{
        this.feedbacklistServer = this.feedbackList;
      }
      
     
     
    })


     
  }   
  setSelected()
  {
    this.feedbackForm.controls['typeOfFeedback'].setValue('Issue Recharging my plan');
  }

createTicket()
{
 this.ticketField =
 {
  EmailAddress : this.feedbackForm.get('email').value,
  PhoneNumber: this.feedbackForm.get('phoneNumber').value,
    Pin: '',
    IssueType: this.feedbackForm.get('typeOfFeedback').value,
    Description: this.feedbackForm.get('yourFeedback').value,
    Notes: this.feedbackForm.get('yourFeedback').value,
   
 };

 this.quickLinksService.postTicketFeedback(this.ticketField).subscribe(
  (response:any) =>{
    this.ticketResponse = response?.Message;
    this.ticketSubmitted = true;
  this.feedbackForm.reset();
  }
 // (err: ApiErrorResponse) =>console.log(err),
 );

}

  close() {
   // this._snackRef.dismiss();
    this.dialogRef.close();
  }

  getAlertClass() {
    let cssClass;
    if (this.type === 'warning') {
      cssClass = 'alert-warning'
    }
    else if (this.type === 'success') {
      cssClass = 'alert-success'
    } else if (this.type === 'error') {
      cssClass = 'alert-danger';
    }

    return `alert-notification ${cssClass}`;
  }


  
onFeedbackFormSubmit(formData: any, formDirective: FormGroupDirective): void {
  if (this.feedbackForm.invalid) 
        return;
        this.createTicket() 
   
  }

}
