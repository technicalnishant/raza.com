import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
//import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { SetitupComponent } from '../dialog/setitup/setitup.component';
import { HowWorksComponent } from '../dialog/how-works/how-works.component';
import { FaqPageComponent } from '../dialog/faq-page/faq-page.component';
import { PlanService } from '../../accounts/services/planService';
import { Plan } from '../../accounts/models/plan';
import { AuthenticationService } from '../../core/services/auth.service';
import { MetaTagsService } from 'app/core/services/meta.service';
 


@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss']
})
export class FeaturesComponent implements OnInit {

  mode = new FormControl('over');
  headerValue: number = 1;
  id: number = 1;
  slideIndex: number = 0;
  slideIndexVal: number = 0;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;

  //public headerCTile: NgxCarousel;
  //public contentCTile: NgxCarousel;
  plan: Plan;

  constructor(public dialog: MatDialog,
    private router: Router,
    private titleService: Title,
    private planService: PlanService,
    private authService: AuthenticationService,
     private metaTagsService:MetaTagsService
  ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Features Page'); 
    this.metaTagsService.getMetaTagsData('features');
    if (this.authService.isAuthenticated()) {
      this.getDefaultPlan();
    }
    this.id = 1;
    this.slideIndex = 0;
    this.slideIndexVal = 0;

    // this.headerCTile = {
    //   grid: { xs: 3, sm: 5, md: 6, lg: 7, all: 0 },
    //   slide: 1,
    //   speed: 400,
    //   loop: false,
    //   animation: 'lazy',
    //   point: {
    //     visible: false
    //   },
    //   load: 2,
    //   touch: true,
    //   easing: 'ease'
    // }

    // this.contentCTile = {
    //   grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    //   slide: 1,
    //   speed: 400,
    //   loop: false,
    //   animation: 'lazy',
    //   point: {
    //     visible: false
    //   },
    //   load: 2,
    //   touch: true,
    //   easing: 'ease'
    // }
  }

  setItUpNow() {
    this.router.navigateByUrl('/account');
  }

  setupOneTouchDial() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account/onetouchSetups', this.plan.PlanId]);
    } else {
      this.setItUpNow();
    }
  }

  setUpPinless() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account/mynumber', this.plan.PlanId]);
    } else {
      this.setItUpNow();
    }
  }

  callDetail() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account/plandetails', this.plan.PlanId]);
    } else {
      this.setItUpNow();
    }
  }

  setUpAutoRefill() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account/autorefill', this.plan.PlanId]);
    } else {
      this.setItUpNow();
    }
  }

  setUpCallForwarding() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account/callForwardingSetups', this.plan.PlanId]);
    } else {
      this.setItUpNow();
    }
  }

  setUpRazaRewards() {
    this.router.navigate(['/account/rewards']);
  }

  setItUpNowRewards() {
    this.dialog.open(SetitupComponent);
  }

  howItWorksPopup() {
    this.dialog.open(HowWorksComponent, {
      data: { slideIndex: this.slideIndexVal }
    });
  }

  faqPopup() {
    this.dialog.open(FaqPageComponent, {
      data: { slideIndex: this.slideIndexVal }
    });
  }

  addClass(id: any) {
    this.id = id;
    this.slideIndex = this.id - 1;
    this.slideIndexVal = this.id - 1;
  }

  public carouselTileLoad(evt: any) {

  }

  // onmoveFn(data: NgxCarouselStore) {
  // }

  // afterCarouselViewedFn(data: NgxCarouselStore) {
  // }

  moveHeaderToLeft() {
    if (this.id > 1) {
      this.id--;
    }
    this.slideIndex = this.id - 1;
    this.slideIndexVal = this.id - 1;
  }

  moveHeaderToRight() {
    if (this.id < 7) {
      this.id++;
    }
    this.slideIndex = this.id - 1;
    this.slideIndexVal = this.id - 1;
  }

  moveHeaderToLeft2() {
    if (this.id > 1) {
      this.id--;
    }
    // this.slideIndex = this.id -1;
    this.slideIndex = this.id;
    this.slideIndexVal = this.id - 1;
  }

  moveHeaderToRight2() {
    if (this.id < 7) {
      this.id++;
    }
    this.slideIndex = this.id - 2;
    this.slideIndexVal = this.id - 1;
  }

  getDefaultPlan() {
    this.planService.getDefaultPlan().subscribe((res: Plan) => {
      this.plan = res;
    })
  }



  
}




