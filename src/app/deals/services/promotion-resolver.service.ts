import { Injectable, Type } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PromotionsService } from './promotions.service';
import { RazaEnvironmentService } from '../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../core/models/current-setting';
import { StandardPromotionComponent } from '../pages/standard-promotion/standard-promotion.component';
import { GridViewPromotionComponent } from '../pages/grid-view-promotion/grid-view-promotion.component';
import { IndiaOneCentComponent } from '../pages/india-one-cent/india-one-cent.component';
import { IndiaUnlimitedComponent } from '../pages/india-unlimited/india-unlimited.component';
import { DealPopupViewComponent } from '../../shared/components/deal-popup-view/deal-popup-view.component';
import { Promotion } from '../model/Promotion';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
    providedIn: 'root'
})
export class PromotionResolverService implements Resolve<any> {
    currentSetting: CurrentSetting;

    constructor(
        private promotionService: PromotionsService,
        private razaEnvService: RazaEnvironmentService,
        public dialog: MatDialog,
        private router: Router
    ) {

    }

    resolve(route: ActivatedRouteSnapshot) {

        const promotionCode: string = route.paramMap.get('promotionCode');

        this.razaEnvService.getCurrentSetting().subscribe(res => {
            this.currentSetting = res;
        })

        return this.getPromotion(promotionCode, this.currentSetting.currentCountryId);
    }

    getPromotion(promotionCode: string, countryId: number) {
        return this.promotionService.getPromotion(countryId, promotionCode);
    }


    getComponent(templateName: string) {
        switch (templateName) {
            case 'DealViewComponent':
                return StandardPromotionComponent
                break;
            case 'DealGridComponent':
                return GridViewPromotionComponent
                break;
            case 'IndiaOneCentComponent':
                return IndiaOneCentComponent
                break;
            case 'IndiaUnlimitedComponent':
                return IndiaUnlimitedComponent;
                break;
            case 'DealPopupViewComponwnt':
                return DealPopupViewComponent;
                break;
            default:
                return ''
                break;
        }
    }


    openPromotion(promotion: Promotion, currentCountryId: number) {
        if (promotion.IsPopupView) {
            this.getPromotion(promotion.PromotionCode, currentCountryId).toPromise()
                .then(res => {
                    const factoryClass = <Type<any>>this.getComponent(promotion.Template);
                    if(this.dialog.openDialogs.length==0){
                    this.dialog.open(factoryClass, {
                        width: '83vw',
                        maxWidth: '1235px',
                        data: res,
                        panelClass: 'my-custom-dialog-class'
                    });
                }
                });


        } else {
            this.router.navigate(['deals', promotion.PromotionCode]);
        }
    }
}