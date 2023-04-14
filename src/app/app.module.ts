import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
//import { TextMaskModule } from 'angular2-text-mask';
import { AppComponent } from './app.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { RecaptchaModule, RecaptchaFormsModule, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

import { CoreModule } from './core/core.module';
//import { HomeModule } from './home/home.module';
//import { DealsModule } from './deals/deals.module';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
//import { MobiledealsModule } from './mobiledeals/mobiledeals.module';

 
import { RazaSplashScreenService } from './core/services/razaSplashScreen.Service';
import { SideBarService } from './core/sidemenu/sidemenu.service';
import { RazaEnvironmentService, LocationService } from './core/services/razaEnvironment.service';

// import { AppComponent } from './app.component';
import { CallUsComponent } from './shared/dialog/call-us/call-us.component';
import { ErrorDialogComponent } from './shared/dialog/error-dialog/error-dialog.component';
//import { Page404Component } from './page404/page404.component';  //23-12-22
//import { LearnmoreComponent } from './globalrates/learnmore/learnmore.component'; //23-12-22
import { GlobalCallComponent } from './globalrates/global-call/global-call.component';
 import { GlobalCallIndiaComponent } from './globalrates/global-call-india/global-call-india.component'; //23-12-22

import { ConfirmPopupDialog } from './shared/dialog/confirm-popup/confirm-popup-dialog';

import { environment } from '../environments/environment';
//import { MobiledealsComponent } from './mobiledeals/mobiledeals.component'; //26-12-22
import { LoginpopupComponent } from './core/loginpopup/loginpopup.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SignuppopupComponent } from './core/signuppopup/signuppopup.component';
import { GlobalratesDialogComponent } from './globalrates/globalrates-dialog/globalrates-dialog.component';
import { FreetrialDialogComponent } from './globalrates/freetrial-dialog/freetrial-dialog.component';
import { GlobalBuyComponent } from './globalrates/global-buy/global-buy.component';
//import { NodataFoundComponent } from './core/nodata-found/nodata-found.component'; //23-12-22
//import { CreateInstanceComponent } from './create-instance/create-instance.component'; //23-12-
//import { Buy5popupComponent } from './globalrates/buy5popup/buy5popup.component'; //23-12-22
 


//import { NgxAutocomPlaceModule } from 'NgxAutocomPlace';//27-12-22
//import { GooglePlacesComponent } from './google-places/google-places.component';//27-12-22
import { AutoLoginComponent } from './auto-login/auto-login.component';
 
 
//import { MobilePayModule } from './mobile-pay/mobile-pay.module'; //26-12-22
 
import { BottomAppScreenComponent } from './bottom-app-screen/bottom-app-screen.component';
import { GlobalCallratesComponent } from './global-callrates/global-callrates.component';
//import { BuyFiveGetFiveComponent } from './buy-five-get-five/buy-five-get-five.component'; //23-12-22
import { CarouselModule } from 'ngx-owl-carousel-o';

import { LazyLoadImageModule } from 'ng-lazyload-image';
//import { MotoComponent } from './moto/moto.component'; //27-12-22
import { CvvBottomComponent } from './cvv-bottom/cvv-bottom.component';
import {MatTooltipModule} from '@angular/material/tooltip';

import {MatIconModule} from '@angular/material/icon';
 
//import { SearchComponent } from './search/search.component';//27-12-22
 
import { OtpDialogComponent } from './core/otp-dialog/otp-dialog.component';
//import { AutoComponent } from './auto/auto.component'; //27-12-22

 
//import {GoogleAnalyticsService} from './services/google-analytics.service';
import { BottomUpComponent } from './mobile-pay/dialog/bottom-up/bottom-up.component';
import { DialogCofirmComponent } from './mobile-pay/dialog/dialog-cofirm/dialog-cofirm.component'; 
var google: any;
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
export function LocationProviderFactory(provider: RazaEnvironmentService) {
 

  return () => provider.getCurrentLocationByIp(); 
   
}

@NgModule({

  declarations: [
    AppComponent,
    CallUsComponent,
    GlobalCallComponent,
    GlobalCallIndiaComponent, //23-12-22
    ErrorDialogComponent,
    ConfirmPopupDialog,
    //Page404Component,  //23-12-22
   // LearnmoreComponent, //23-12-22
    //MobiledealsComponent,//26-12-22
    LoginpopupComponent,
    SignuppopupComponent,
    GlobalratesDialogComponent,
    FreetrialDialogComponent,
    GlobalBuyComponent,
   // NodataFoundComponent, //23-12-22
    //CreateInstanceComponent, //23-12-22
    //Buy5popupComponent, //23-12-22
   // GooglePlacesComponent,//27-12-22
    AutoLoginComponent, //23-12-22
    
    BottomAppScreenComponent,
    
    GlobalCallratesComponent,
    
    //BuyFiveGetFiveComponent, //23-12-22
    
   
    //MotoComponent,//27-12-22
    CvvBottomComponent,
    //SearchComponent, //27-12-22
    OtpDialogComponent,
   // AutoComponent, //27-12-22
    BottomUpComponent,
    DialogCofirmComponent
         

  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    CoreModule,  
    //HomeModule, //to check page spead
    // DealsModule, //to check page spead

    SharedModule,
    MatButtonModule,
    MatDialogModule,
    //MobiledealsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
	 // NgxAutocomPlaceModule, //27-12-22
	  //MobilePayModule, //26-12-22
    // TextMaskModule,
    CarouselModule,
    LazyLoadImageModule,
    MatTooltipModule,
    MatIconModule,
    MatBottomSheetModule, 
	

  ],

  entryComponents: [
    CallUsComponent,
    GlobalCallComponent,
    GlobalCallIndiaComponent,
    ErrorDialogComponent,
    ConfirmPopupDialog,
	 
  ],
  
  providers: [
    //GoogleAnalyticsService,
    RazaSplashScreenService,
    SideBarService,
    LocationService,
    RazaEnvironmentService,
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.captchaKeyV3 },
    { provide: APP_INITIALIZER, useFactory: LocationProviderFactory, deps: [RazaEnvironmentService], multi: true },

    
  ],

  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
