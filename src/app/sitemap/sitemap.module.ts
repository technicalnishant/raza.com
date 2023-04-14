import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitemapComponent } from '../sitemap/sitemap.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ SitemapComponent,],
  imports: [
    CommonModule,
    RouterModule.forChild([{path:'', component:SitemapComponent}])
  ]
})
export class SitemapModule { }
