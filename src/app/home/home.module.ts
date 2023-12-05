import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { HomepageComponent } from './homepage/homepage.component';
import { RouterModule } from '@angular/router';
import { TestimonialsComponent } from '../shared/testimonials/testimonials.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxSplideModule } from 'ngx-splide';
//import { CustomHomeComponent } from './custom-home/custom-home.component';
// import { ModalVideoComponent } from './modal-video/modal-video.component';

// import { LazyimgDirective } from '../core/lazyimg.directive';
// import { PromotionComponent } from '../promotion/promotion.component';
//import { SharedModule } from '../shared/shared.module';
//import { EnvVariableComponent } from './env-variable/env-variable.component';
//import { HomepageChristmasComponent } from './homepage-christmas/homepage-christmas.component';
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';


@NgModule({
    imports: [
        // FormsModule,
        // ReactiveFormsModule,
        MaterialModule,
        MatAutocompleteModule,
        MatDialogModule,
        // SharedModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        CarouselModule,
        NgxSplideModule,
        MatCarouselModule.forRoot(),
       // LazyLoadImageModule,
        RouterModule.forChild([
            { path: '', component: HomepageComponent },
            { path: 'p/:promo', component: HomepageComponent },
            { path: 'mobileapp', component: HomepageComponent, data: { scrollToMobileApp: true } },
            { path: 'update_password/:number', component: HomepageComponent, data: { scrollToMobileApp: true } },
          //  { path: 'env', component: EnvVariableComponent },
        ])
    ],
    exports: [
        HomepageComponent,
       CommonModule,
        MatCarouselModule
    ],
    declarations: [
        HomepageComponent,
       // HomepageChristmasComponent,
       // EnvVariableComponent,
        TestimonialsComponent,
        // PromotionComponent,
        //CustomHomeComponent,
        // ModalVideoComponent,
        //LazyimgDirective
    ],
    providers: []
})
export class HomeModule { };
