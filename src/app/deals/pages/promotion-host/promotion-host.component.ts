import { Component, OnInit, ComponentFactoryResolver, Type, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Promotion } from '../../model/Promotion';
import { PromotionHostDirective } from '../../directive/promotion-host.directive';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { Subscription } from 'rxjs';
import { PromotionsService } from '../../services/promotions.service';
import { StandardPromotionComponent } from '../standard-promotion/standard-promotion.component';
import { IndiaOneCentComponent } from '../india-one-cent/india-one-cent.component';
import { IndiaUnlimitedComponent } from '../india-unlimited/india-unlimited.component';
import { GuyanaComponent } from '../guyana/guyana.component';
import { GridViewPromotionComponent } from '../grid-view-promotion/grid-view-promotion.component';
import { DealPopupViewComponent } from '../../../shared/components/deal-popup-view/deal-popup-view.component';
import { MatDialog } from '@angular/material/dialog';
import { PromotionResolverService } from '../../services/promotion-resolver.service';

@Component({
  selector: 'app-promotion-host',
  templateUrl: './promotion-host.component.html',
  styleUrls: ['./promotion-host.component.scss']
})
export class PromotionHostComponent implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild(PromotionHostDirective,{static: true}) promotionHost: PromotionHostDirective;
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private route: ActivatedRoute,
    private router: Router,
    private razaEnvService: RazaEnvironmentService,
    private promotionService: PromotionsService,
    public dialog: MatDialog,
    public promotionResolverService: PromotionResolverService
  ) { }

  ngOnInit() {

    var promotionCode: string = this.route.snapshot.paramMap.get('promotionCode');
    
    if(promotionCode == 'get-upto-1500')
    promotionCode = 'buy1-get1';

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    })

    console.log(promotionCode);
    /*if(promotionCode == 'guyana')
    {
      const factoryClass = <Type<any>>this.promotionResolverService.getComponent('GuyanaComponent');
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
      const viewContainerRef = this.promotionHost.viewContainerRef;
      viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
    (<any>componentRef.instance).promotion = 'guyana';
       (<any>componentRef.instance).currentSetting = this.currentSetting; 
    }
    else{}*/
      this.getPromotion(promotionCode, this.currentSetting.currentCountryId).toPromise().then(res => {
        this.loadComponent(res);
      })
    
   

  }

  ngOnDestroy(): void {
    this.currentSetting$.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.router.events.subscribe((res: NavigationEnd) => {
      if (res instanceof NavigationEnd) {
        const promotionCode = this.route.snapshot.paramMap.get('promotionCode');
        this.getPromotion(promotionCode, this.currentSetting.currentCountryId).toPromise().then(res => {
          this.loadComponent(res);
        });
      }
    })
  }

  getPromotion(promotionCode: string, countryId: number) {
    return this.promotionService.getPromotion(countryId, promotionCode);
  }

  loadComponent(promotion: Promotion) {

    const factoryClass = <Type<any>>this.promotionResolverService.getComponent(promotion.Template);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(factoryClass);
    const viewContainerRef = this.promotionHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<any>componentRef.instance).promotion = promotion;
    (<any>componentRef.instance).currentSetting = this.currentSetting;
  }



}
