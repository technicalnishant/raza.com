import { Component, OnInit, Inject, Injector, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { AppBaseComponent } from '../../components/app-base-component';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { Subscription } from 'rxjs';
import { CurrentSetting } from 'app/core/models/current-setting';
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

  moreOptions:boolean=false;
  sendAgainMsg:boolean=false;
 countryCode:any=''
 enteredPhone:any;
 currentSetting$: Subscription;
  currentSetting: CurrentSetting;
customerCare:any = '1-877.463.4233';
isPhone = false;
  @ViewChildren('formRow') rows: any;

  constructor(
    public dialogRef: MatDialogRef<OtpConfirmationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
    _injector: Injector
  ) {
    super(_injector);
    this.otpConfirmForm            = this.toFormGroup(this.formInput);
  }

  ngOnInit() {
    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      this.setcurrentCurrency();
    });
    this.phoneNumber = this.data.phoneNumber

    this.countryCode = this.data.countryCode;
    this.enteredPhone = this.data.phone;
    // this.otpConfirmForm = this.formBuilder.group({
    //   otp: ['', [Validators.required]],
    //  });

    var phoneno = /^[0-9]+$/;
    if( this.enteredPhone.match(phoneno) )
      {
        this.isPhone = true;
      }
  }

  toFormGroup(elements) {
    const group: any = {};

    elements.forEach(key => {
      group[key] = new FormControl('', Validators.required);
    });
    group['otp'] = new FormControl('', Validators.required);

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

  keyUpEvent(event, index) {
    this.invalidOtp = '';
    let pos = index;

    if ((event.keyCode === 8 && event.which === 8) || (event.keyCode === 37 && event.which === 37)) {
      pos = index - 1 ;
    } else {
      pos = index + 1 ;
    }

    if (pos > -1 && pos < this.formInput.length ) {
      this.rows._results[pos].nativeElement.focus();

    }
    if((event.target as HTMLInputElement).value == '')
    {
      return false
    }
    if(pos == this.formInput.length)
      this.onSubmit()

  }
  onSubmit(): void {

    let otp = this.otpConfirmForm.value.input1+this.otpConfirmForm.value.input2+this.otpConfirmForm.value.input3+this.otpConfirmForm.value.input4+this.otpConfirmForm.value.input5+this.otpConfirmForm.value.input6;
    //this.otpConfirmForm.value.otp = otp;

    this.otpConfirmForm.get('otp').setValue(otp)

    this.onOtpConfirmFormSubmit();
  }

  keyPressEvent(event, index) {


  }

  formattedNumber(obj)
  {
    const phoneNumber = obj;
    const formattedNumber = phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    return formattedNumber; // Output: 312 975 8545
 
  }
  processForgot1()
  {
    const phoneWithCountryCode = `${this.countryCode}${this.enteredPhone}`
    this.executeCaptcha('login').toPromise().then(token => 
      {
       this.authService.sendOtpForRegister(phoneWithCountryCode, token).toPromise()
      .then(res => {
        this.sendAgainMsg = true;
        this.moreOptions = false;
      })
    })
  }

  
  setcurrentCurrency()
  {
    if(this.currentSetting.country.CountryId == 1)
    {
  
      this.customerCare = '1-877.463.4233';
    }
      
      if(this.currentSetting.country.CountryId == 2)
      {
       
        this.customerCare='1-800.550.3501';
      }
      
      if(this.currentSetting.country.CountryId == 3)
      {
        
        this.customerCare='44 800-041-8192';

      }
     
      if(this.currentSetting.country.CountryId == 8)
      {
         
        this.customerCare='61283173403';
      }
    
      if(this.currentSetting.country.CountryId == 20)
      {
        
        this.customerCare='6498844133';
      }
    
      if(this.currentSetting.country.CountryId == 26)
      {
        
        this.customerCare='1-877.463.4233';
      } 
  }

}
