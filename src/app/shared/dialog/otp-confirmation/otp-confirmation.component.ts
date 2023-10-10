import { Component, OnInit, Inject, Injector } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AppBaseComponent } from '../../components/app-base-component';
@Component({
  selector: 'app-otp-confirmation',
  templateUrl: './otp-confirmation.component.html',
  styleUrls: ['./otp-confirmation.component.scss']
})
export class OtpConfirmationComponent extends AppBaseComponent implements OnInit {

  otpConfirmForm: FormGroup;
  wrongOtp:boolean=false;
  phoneNumber:any;
  form: FormGroup;
  forgotPassError:String='';
  invalidOtp:String='';
  forgotPassSubmitted:boolean=false;
  formInput = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6'];
  constructor(
    public dialogRef: MatDialogRef<OtpConfirmationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    _injector: Injector
  ) {
    super(_injector);
    this.form           = this.toFormGroup(this.formBuilder);
  }

  ngOnInit() {
    this.phoneNumber = this.data.phoneNumber
   
    this.otpConfirmForm = this.formBuilder.group({
      otp: ['', [Validators.required]],
    });
  }

  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    return new FormGroup(group);
  }
  closeIcon(): void {
    this.dialogRef.close();
  }

  onOtpConfirmFormSubmit() {
    this.wrongOtp   = false;
    if (!this.otpConfirmForm.valid) {
      return;
    }
     this.executeCaptcha('login').toPromise().then(token => {
    this.authService.verifyOtp(this.data.phoneNumber, this.otpConfirmForm.value.otp, token).toPromise()
      .then((res: boolean) => {
       console.log("api resp is ", res);
        if (res) {
          this.dialogRef.close(this.otpConfirmForm.value.otp);
        } else {
          this.wrongOtp = true;
         
        }
      });
    });
  }

}
