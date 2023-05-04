import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { MaterialModule } from './material.module';
import { LogintopdropmenuComponent } from './logintopdropmenu/logintopdropmenu.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/auth.service';
import { HelperService } from './services/helper.service';
import { JwtInterceptor } from './interceptor/JwtInterceptor';
import { RazaSplashScreenService } from './services/razaSplashScreen.Service';
import { SpinnerRazaTagHelperComponent } from './spinner/components/spinner/spinnerTagHelper.component';
import { HttpLoadInterceptor } from './spinner/interceptors';
import { AccountTopMenuComponent } from './components/account-top-menu/account-top-menu.component';
import { AnonomysOnlyGuard } from './guards/anonomys-only.guard';
import { LogintopdropmenuMobileComponent } from './logintopdropmenumobile/logintopdropmenumobile.component';
import { DealsTabComponent } from '../shared/deals-tab/deals-tab.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

 
 /*
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
	FormsModule,
    MaterialModule,
	MatProgressBarModule,
	MatAutocompleteModule,
	ReactiveFormsModule,
	SharedModule,
 
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    LogintopdropmenuComponent,
    LogintopdropmenuMobileComponent,
    SpinnerRazaTagHelperComponent,
    MaterialModule,
	//SocialLoginModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    LogintopdropmenuComponent,
    LogintopdropmenuMobileComponent,
    SpinnerRazaTagHelperComponent,
    AccountTopMenuComponent,
    DealsTabComponent
  ],
  providers: [
    AuthGuard,
    AnonomysOnlyGuard,
    AuthenticationService,
    RazaSplashScreenService,
    HelperService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpLoadInterceptor, multi: true },
	/*{provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '475592938753-8pabq5bhkdocnl8usrdm2hcugrhr0p8k.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig}*/
  ],
  schemas: [ 
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CoreModule { };