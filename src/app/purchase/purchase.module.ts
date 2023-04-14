import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './pages/register/register.component';
import { MaterialModule } from '../core/material.module';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaymentInfoComponent } from './pages/payment-info/payment-info.component';
import { PurchaseConfirmationComponent } from './pages/purchase-confirmation/purchase-confirmation.component';
import { PaymentModule } from '../payments/payment.module';
 

@NgModule({
  declarations: [
    RegisterComponent,
    PaymentInfoComponent,
    PurchaseConfirmationComponent 
  ],
  imports: [
    PurchaseRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PaymentModule
  ]
})
export class PurchaseModule { }
