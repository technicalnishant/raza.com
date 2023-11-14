import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from './core/services/auth.service';
//import { RazaSplashScreenService } from './core/services/razaSplashScreen.Service';
import { SideBarService } from './core/sidemenu/sidemenu.service';
import { RazaEnvironmentService } from './core/services/razaEnvironment.service';
import { LoaderService } from './core/spinner/services';
import { RazaLayoutService } from './core/services/raza-layout.service';
import { CurrentSetting } from './core/models/current-setting';
import { Country } from './core/models/country.model';
import { environment } from '../environments/environment';
//declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentURL:any;
  showDelayedSubcomponent:boolean = false;
  constructor(private router: Router,
    private authService: AuthenticationService,
    //private razaSplashScreen: RazaSplashScreenService,
    private sideBarService: SideBarService,
    private loaderService: LoaderService,
    private razaLayoutService: RazaLayoutService,
    private razaEnvSerivce: RazaEnvironmentService,

  ) {
    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd){

    //     console.log(event.urlAfterRedirects);
    //     gtag('config', 'UA-168497906-1', {'page_path': event.urlAfterRedirects});
    //   }
    // })
  }

  @ViewChild('sidenav',{static: true}) sidenav: MatSidenav;
  country: Country;
  title = 'app';
  mode = new FormControl('over');

  ngOnInit() {

    this.currentURL = window.location.href;
    if (environment.production) {
      if (location.protocol === 'http:') {
        if (!location.href.includes('www')) {
          window.location.href = location.href.replace('http://', 'https://www.');
        } else {
          window.location.href = location.href.replace('http', 'https');
        }
      }
    }

    let lat: number;
    let long: number;
  if(!this.currentURL.includes('raza-us'))
	this.getCurrentLocation(lat, long);
	/*
    const geo = navigator.geolocation.getCurrentPosition(a => {
      lat = a.coords.latitude;
      long = a.coords.longitude;
      this.getCurrentLocation(lat, long);
    });*/


    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    this.sideBarService.sidenav = this.sidenav;
   // console.log("Router URl is");
    //console.log(this.currentURL);


    if(this.currentURL.includes('recharge?promotion='))
    {
      //https://localhost:4200/recharge?promotion=HALLOWEEN21
      //this.router.navigateByUrl("/buy5_get5");
      //https://www.raza.com/?promo=4THOFJULY
      var url_arr = this.currentURL.split("=");
      if( url_arr[1] =='buy5get5' )
      this.router.navigateByUrl("/buy5_get5");
      else
      {
       localStorage.setItem("promotionCode",url_arr[1] );
       this.router.navigateByUrl("/?promo="+url_arr[1]);
      }

    }

    // Set the delay in milliseconds (e.g., 3000ms = 3 seconds)
    setTimeout(() => {
      this.showDelayedSubcomponent = true;
    }, 1500);
  }

  get IsEnableFreeTrial(): boolean {
		if (!this.authService.isAuthenticated()) {
		  return true;
		}
    return this.authService.isNewUser();
  }

  getCurrentLocation(lat: number, long: number) {
    //this.razaEnvSerivce.getCurrentLocation(lat, long)
    this.razaEnvSerivce.getCurrentLocationWithIp(lat, long)
      .subscribe((res: Country) => {
        this.initCurrentSetting(res);
      })
  }

  initCurrentSetting(country: Country) {
    const setting = new CurrentSetting();
    setting.country = country;
    this.razaEnvSerivce.setCurrentSetting(setting)
  }

  toggleSideNav() {
    this.sidenav.toggle();
  }

  freeTrial() {
    this.toggleSideNav();
    this.router.navigateByUrl("/freetrial");
  }



  ngAfterViewInit() {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loaderService.displayLoader(true);
        }
        else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.loaderService.displayLoader(false);
          this.razaLayoutService.setFixedHeader(false);
        }
      });
  }

}
