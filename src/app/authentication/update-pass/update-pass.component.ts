import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../core/services/auth.service';
import { ConfirmPasswordValidator } from '../../shared/validators/confirm-password-validator';
import { UpdatePasswordSuccessDialog } from '../../accounts/dialog/update-password-success/update-password-success.dialog';
import { RazaLayoutService } from '../../core/services/raza-layout.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-pass',
  templateUrl: './update-pass.component.html',
  styleUrls: ['./update-pass.component.scss']
})
export class UpdatePassComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private razaLayoutService: RazaLayoutService,
    private route: ActivatedRoute,
  ) { }

  updatePasswordForm: FormGroup;
  userToken:any
  showContinue:boolean=false
  number_err:boolean=true
  atoz_err:boolean=true
  spcl_err:boolean=true
  showPass:boolean=false
  showConfPass:boolean=false
  submitted:boolean=false;
  ngOnInit() {
    this.razaLayoutService.setFixedHeader(true);
    this.userToken = this.route.snapshot.params['token'];

    if(this.userToken !='')
    {
     // console.log(this.userToken);
       this.loginWithToken();
    }

    this.updatePasswordForm = this.formBuilder.group({
     password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/), 
      Validators.pattern(/[a-zA-Z]/), 
      
 

      ]],

      

      confirmPassword: ['', [Validators.required]],
    },
      {
        validator: ConfirmPasswordValidator.MatchPassword
      }
    );
  }
  get f() { return this.updatePasswordForm.controls; }
  loginWithToken() 
  {
    
      
       let body = {
          username: this.userToken,
          password: '0000000000',
          captcha: ''
        };
     
        this.authService.loginwToken(body, false, "Y").subscribe((response) => {
          //this.authService.login(body, false, "Y").subscribe((response) => {
            
          if (response != null) {
             
           localStorage.setItem('update_pass', 'yes');
           localStorage.setItem("login_no", response['additionalId']);
            this.showContinue = true;
          }  
        },
        (error) => {

        //  const dialogRef = this.dialog.open(ErrLoginComponent, {
        //     data: {
        //       success: 'success',
        //     }
        //   });
           
          
        });

       /* this.executeCaptcha('login').subscribe((token) =>{ },(error) => {
          console.log("error "+error); 
          } ) */

  }

  submitUpdatePasswordForm(): void {
    this.submitted = true;
    if (this.updatePasswordForm.valid) {
      let password = this.updatePasswordForm.get('password').value;
      this.authService.updatePassword(password).subscribe(
        (res: boolean) => {
          if (res)
            this.dialog.open(UpdatePasswordSuccessDialog);
          this.updatePasswordForm.reset();
          localStorage.removeItem("update_pass");
        }
      )
    }
  }

  onKeypressEvent(event: any){
    let string = event.target.value;
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\d]+/;
    var atz = /[a-zA-Z]+/;
    // number_err:boolean=true
    //   atoz_err:boolean=true
    //   spcl_err:boolean=true

    if(atz.test(string)){
      this.atoz_err = false;
    }
    else{
      this.atoz_err = true;
    }

    if(format.test(string)){
      this.spcl_err = false;
    }
    else{
      this.spcl_err = true;
    }

    if(string.length>=8 && string.length <= 15)
    {
    this.number_err = false;
    }
    else{
      this.number_err = true
    }
       // console.log(event.target.value);
    
    }


    showPassword()
    {
     
      this.showPass = !this.showPass;
      // if(this.showPass)
      // {
      //   this.showPass = false
      // }
      // else{
      //   this.showPass = true;
      // }

      // console.log(this.showPass);
    }
    setShowConfPass()
    {
      this.showConfPass = !this.showConfPass;

      // if(this.showConfPass)
      // {
      //   this.showConfPass = false
      // }
      // else{
      //   this.showConfPass = true;
      // }

    }
}
