//import { CarouselModule } from 'ngx-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
//import { ScrollToModule } from 'ng2-scroll-to-el';
//import { NgxCarouselModule } from 'ngx-carousel';
//import { SlickModule } from 'ngx-slick';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
   // CarouselModule.forRoot(),
   // ScrollToModule.forRoot(),
    NgbModule,
    //SlickModule.forRoot(),
    MatCheckboxModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    //NgxCarouselModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatExpansionModule,
    MatCardModule,
    MatRippleModule,
    MatProgressSpinnerModule
  ],
  exports: [
   // CarouselModule,
   // ScrollToModule,
    NgbModule,
    //SlickModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatRadioModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatTableModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatTooltipModule,
    //NgxCarouselModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatExpansionModule,
    MatCardModule,
    MatRippleModule,
    MatProgressSpinnerModule
  ],
  declarations: [],
  providers: []
})
export class MaterialModule { };