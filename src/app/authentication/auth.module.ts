import { NgModule } from '@angular/core';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
//import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module } from 'ng-recaptcha';
import { AutoSigninComponent } from './pages/auto-signin/auto-signin.component';
 
import { UpdatePassComponent } from './update-pass/update-pass.component';
import { DeleteAccountComponent } from './pages/delete-account/delete-account.component';


@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    // RecaptchaModule,
    // RecaptchaFormsModule,
    // RecaptchaV3Module,
    RouterModule.forChild([
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'update_password/:token', component: UpdatePassComponent },
      {path:'delete_account', component:DeleteAccountComponent}
      //{ path: 'sign-in', component: SignInComponent },
      
 
     // { path: 'sign-up', component: SignUpComponent },

    ])
  ],
  exports: [
  ],
  declarations: [
    ForgotPasswordComponent,
    SignInComponent,
    SignUpComponent,
    AutoSigninComponent, 
    UpdatePassComponent, DeleteAccountComponent,
  ],
  providers: [],


})
export class AuthModule { };