import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotoComponent } from './moto.component';
import { SharedModule } from '../shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';

import {MatIconModule} from '@angular/material/icon';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [MotoComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      {path:'', component:MotoComponent},
      {path:':motoId', component:MotoComponent},
    ])

  ]
})
export class MotoModule { }
