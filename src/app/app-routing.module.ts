import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { AnonomysOnlyGuard } from './core/guards/anonomys-only.guard';
import { HomepageComponent } from './home/homepage/homepage.component';
import { MobiledealsComponent } from './mobiledeals/mobiledeals.component';

//import { LearnmoreComponent } from './globalrates/learnmore/learnmore.component';

//import { CreateInstanceComponent } from './create-instance/create-instance.component';

import { Page404Component } from './page404/page404.component';
import { Buy5get5Component } from './deals/pages/buy5get5/buy5get5.component';

 import { AutoLoginComponent } from './auto-login/auto-login.component';
import { GlobalCallratesComponent } from './global-callrates/global-callrates.component';
//import { BuyFiveGetFiveComponent } from './buy-five-get-five/buy-five-get-five.component';
//import { SitemapComponent } from './sitemap/sitemap.component';
import { MotoComponent } from './moto/moto.component';
import { AutoComponent } from './auto/auto.component';
import { SearchComponent } from './search/search.component';
const routes: Routes = [
 // { path: '', component: HomepageComponent, pathMatch: 'full' },
  { path:'', loadChildren:()=> import('./home/home.module').then(m=>m.HomeModule)},
 // { path: 'generate_nonce', component: CreateInstanceComponent, pathMatch: 'full' },

 
  { path: 'ref/:signup_code', component: HomepageComponent },

  { path: 'mobileapp', component: HomepageComponent, data: { scrollToMobileApp: true } },

  { path: 'auth', loadChildren: () => import('./authentication/auth.module').then(m => m.AuthModule), canActivate: [AnonomysOnlyGuard] },
  { path: 'account', loadChildren: () => import('./accounts/account.module').then(m => m.AccountModule), canActivate: [AuthGuard] },
  { path: 'recharge', loadChildren: () => import('./recharge/recharge.module').then(m => m.RechargeModule) },
  
  { path: 'aboutus', loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutusModule) },
  { path: 'howitworks', loadChildren: () => import('./howitworks/howitworks.module').then(m => m.HowitworksModule) },
  { path: 'contactus', loadChildren: () => import('./contactus/contactus.module').then(m => m.ContactusModule) },
  { path: 'becomeapartner', loadChildren: () => import('./becomeapartner/becomeapartner.module').then(m => m.BecomeapartnerModule) },

  { path: 'features', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule) },
  { path: 'searchrates', loadChildren: () => import('./rates/searchrates.module').then(m => m.SearchratesModule) },
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
  { path: 'feedback', loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule) },
  { path: 'refer-a-friend', loadChildren: () => import('./refer/refer.module').then(m => m.ReferModule) },

  { path: 'mobiletopup', loadChildren: () => import('./mobiletopup/mobiletopup.module').then(m => m.MobiletopupModule) },
  { path: 'virtualnumber', loadChildren: () => import('./virtualnumber/virtualnumber.module').then(m => m.VirtualnumberModule) },

  { path: 'mobileterms', loadChildren: () => import('./mobileterms/mobileterms.module').then(m => m.MobiletermsModule) },
  { path: 'termsandcondition', loadChildren: () => import('./termsandcondition/termsandcondition.module').then(m => m.TermsandconditionModule) },
  { path: 'landing-page', loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule) },

  { path: 'support', loadChildren: () => import('./privacypolicy/privacypolicy.module').then(m => m.PrivacypolicyModule) },

  { path: 'callafrica', loadChildren: () => import('./callafrica/callafrica.module').then(m => m.CallafricaModule) },
  { path: 'callasia', loadChildren: () => import('./callasia/callasia.module').then(m => m.CallasiaModule) },
  { path: 'deals', loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule) },

  { path: 'freetrial', loadChildren: () => import('./freetrial/freetrial.module').then(m => m.FreeTrialModule) },
  { path: 'purchase', loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
  
  
  { path: 'mobiledeals', component: MobiledealsComponent, data: { scrollToMobileApp: true } },
  { path: 'auto-sign-in/:userPhone/:userPass', component: AutoLoginComponent },
  //{ path: 'sitemap', component: SitemapComponent },
  { path:'sitemap', loadChildren:()=>import('./sitemap/sitemap.module').then(m=>(m.SitemapModule))},
  //{ path: 'learnmore', component: LearnmoreComponent },
  { path:'learnmore', loadChildren:()=>import('./learnmore/learnmore.module').then(m=>(m.LearnmoreModule))},
  { path:'404', loadChildren:()=>import('./page404/page404.module').then(m=>(m.Page404Module))},
  //{path: '404', component: Page404Component},
  { path: 'buy_five_get_five', component: Buy5get5Component},
  { path: 'globalcallrates', component: GlobalCallratesComponent},
  
  { path: 'globalcallrates/:country_name', component: GlobalCallratesComponent},
  { path: 'call/:country_name', component: GlobalCallratesComponent},
  { path: 'rates/:country_name', component: GlobalCallratesComponent},

  { path:'buy5_get5', loadChildren:()=>import('./buy-five-get-five/buy-five-get-five.module').then(m=>(m.BuyFiveGetFiveModule))},
  { path:'buy', loadChildren:()=>import('./buy-five-get-five/buy-five-get-five.module').then(m=>(m.BuyFiveGetFiveModule))},
  //{ path: 'buy5_get5', component: BuyFiveGetFiveComponent },
  //{ path: 'buy', component: BuyFiveGetFiveComponent },
  
 // { path: 'moto/:motoId', component: MotoComponent },
  { path:'moto', loadChildren:()=>import("./moto/moto.module").then(m=>(m.MotoModule))},
  { path:'auto', loadChildren:()=>import("./auto/auto.module").then(m=>(m.AutoModule))},
  //{ path: 'auto/:motoId', component: AutoComponent },
   //https://raza.com/buy?promotion=buy5get5
  //{ path: '**',  redirectTo: './404' },
  { path:'search', loadChildren:()=>import("./search/search.module").then(m=>(m.SearchModule))},
  // { path: 'search/:country', component: SearchComponent }, //27-12-2022
  { path: 'mobile_pay', loadChildren: () => import('./mobile-pay/mobile-pay.module').then(m => m.MobilePayModule) },
  { path: 'refer', loadChildren:()=>import('./refer/refer.module').then(m=>m.ReferModule)},
  { path: 'raza-us', loadChildren: () => import('./raza-us/raza-us.module').then(m => m.RazaUsModule) },
  { path: '**', pathMatch: 'full',  component: Page404Component },
];


@NgModule({
  imports: [
   // RouterModule.forRoot(routes, { preloadingStrategy:PreloadAllModules, scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' } )
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' } )
  ],
  exports: [RouterModule]

})
export class AppRoutingModule {

 }