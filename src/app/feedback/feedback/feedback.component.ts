import { Component, OnInit , HostListener} from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FeedbackService } from '../feedback.service';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  selected='';
  mode = new FormControl('over');
  headerValue : number = 1;
  feedbackForm: FormGroup;

constructor(private router: Router, private titleService: Title, private formBuilder: FormBuilder,
            public snackbar: RazaSnackBarService, private quickLinksService: FeedbackService) { }

  ngOnInit() {
    this.titleService.setTitle('Feedback');
    this.createFeedBackForm();
  }

createFeedBackForm(){
    this.feedbackForm = this.formBuilder.group({
			firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required,Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
      typeOfFeedback: new FormControl('', Validators.required),
      yourFeedback: new FormControl('', Validators.required)
		});
  }

@HostListener('window:scroll', ['$event'])
    checkScroll() {
      const scrollPosition = window.pageYOffset
      
      if(scrollPosition > 5){
        this.headerValue = 2;

      }else{
        this.headerValue = 1;
      }

}

onFeedbackFormSubmit(formData: any, formDirective: FormGroupDirective): void {
  if (this.feedbackForm.invalid) 
        return;

  var feedbackData={
      IsRazaCustomer:false,
      FeedBackType: this.feedbackForm.get('typeOfFeedback').value,
      FirstName: this.feedbackForm.get('firstName').value,
      LastName: this.feedbackForm.get('lastName').value,
      PhoneNumber: this.feedbackForm.get('phoneNumber').value,
      EmailAddress: this.feedbackForm.get('email').value,
      Feedback: this.feedbackForm.get('yourFeedback').value
  }

  this.quickLinksService.postSubmittedFeedback(feedbackData).subscribe(
      (response) =>{
       // console.log(response);
        this.snackbar.openSuccess("Thank you for your feedback. Your feedback has been submitted successfully.");
      }
     // (err: ApiErrorResponse) =>console.log(err),
     );

     
    //Reset form
    formDirective.resetForm();
    this.feedbackForm.reset();
  }

}
