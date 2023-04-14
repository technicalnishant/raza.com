import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RazaPaypalComponent } from './component/raza-paypal.component';
import { ScriptService } from './service/script.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RazaPaypalComponent,
  ],
  exports: [
    RazaPaypalComponent,
  ],
  providers: [
    ScriptService
  ]
})
export class RazaPaypalModule { }
