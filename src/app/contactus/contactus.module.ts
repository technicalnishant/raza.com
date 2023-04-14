import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../core/material.module';
import { SharedModule } from '../shared/shared.module';
import { ContactusComponent } from './contactus/contactus.component';
import { ContactusService } from './contactus.service';
import { MessageUsComponent } from './dialog/message-us/message-us.component';

@NgModule({
  imports: [
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ContactusComponent },
    ])
  ],
  exports: [
    ContactusComponent
  ],
  declarations: [
    ContactusComponent,
    MessageUsComponent
  ],
  providers: [ContactusService],
  entryComponents: [
    MessageUsComponent
  ]
})
export class ContactusModule { };