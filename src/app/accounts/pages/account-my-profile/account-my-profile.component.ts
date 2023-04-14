import { Component, OnInit } from '@angular/core';
import { BillingInfo } from '../../models/billingInfo';
import { CustomerService } from '../../services/customerService';
import { MatDialog } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { EditBillingInfoDialog } from '../../dialog/edit-billing-info-dialog/edit-billing-info-dialog';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { Title } from '@angular/platform-browser';
import { UpdatePasswordDialog } from '../../dialog/update-password/update-password';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'app-account-my-profile',
  templateUrl: './account-my-profile.component.html',
  styleUrls: ['./account-my-profile.component.scss'],
  providers: [
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ]
})
export class AccountMyProfileComponent implements OnInit {
  billingInfo: BillingInfo;
  constructor(
    private titleService: Title,
    private customerService: CustomerService,
    private dialog: MatDialog,
    private razalayoutService: RazaLayoutService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('My Profile');
    this.razalayoutService.setFixedHeader(true);
    this.loadBillingInfo();
  }

  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
      })
  }

  editProfile() {
    this.dialog.open(EditBillingInfoDialog,
      {
        data: {
        }
      });
  }

  updatePassword() {
    this.dialog.open(UpdatePasswordDialog,
      {
        data: {
        }
      });
  }
}
