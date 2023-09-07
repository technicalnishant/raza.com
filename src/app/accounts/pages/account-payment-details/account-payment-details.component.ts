import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/internal/Subscription';
//import { isNullOrUndefined } from 'util';
import { CurrentSetting } from '../../../core/models/current-setting';
import { isNullOrUndefined } from "../../../shared/utilities";

import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

import { CreditCard } from '../../models/creditCard';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { AutoRefill, AutoRefillStatus } from '../../models/autorefill';
import { AddCreditcardDialog } from '../../dialog/add-creditcard-dialog/add-creditcard-dialog';
import { ConfirmPopupDialog } from '../../dialog/confirm-popup/confirm-popup-dialog';

@Component({
  selector: 'app-account-payment-details',
  templateUrl: './account-payment-details.component.html',
  styleUrls: ['./account-payment-details.component.scss']
})
export class AccountPaymentDetailsComponent implements OnInit, OnDestroy {
  creditCards: CreditCard[] = []; isMobileDevice: boolean = false;
  billingInfo: any;
  autorefill: AutoRefill;
  pin: string;
  cardCount: number;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private customerService: CustomerService,
    private razaSnackbarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    private razalayoutService: RazaLayoutService,
    private titleService: Title) {
    this.pin = this.route.snapshot.paramMap.get('pin');
  }

  ngOnInit() {
    this.titleService.setTitle('Payment Details');
    this.razalayoutService.setFixedHeader(true);
    this.customerService.getSavedCreditCards().subscribe(
      (data: CreditCard[]) => {
        this.creditCards = data;
        this.cardCount = data.length;
      },
      (err: ApiErrorResponse) => console.log(err),
    )

    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
    });

    if (!isNullOrUndefined(this.pin)) {
      this.getAutoEnroll();
    }
    this.loadBillingInfo();
  }

  ngOnDestroy(): void {
    this.currenctSetting$.unsubscribe();
  }

  getAutoEnroll() {
    if(this.pin)
    {
      
      this.customerService.getAutoRefill(this.pin).subscribe(
        (data: AutoRefill) => {
          this.autorefill = data;
        },
        (err: ApiErrorResponse) => console.log(err),
      );
    }
    
  }

  isEnableSubscribeButton(): boolean {
    if (this.autorefill.Status !== null) {
      switch (this.autorefill.Status) {
        case AutoRefillStatus.Active:
          return false;
          break;
        case AutoRefillStatus.Blocked:
          return false;
          break;
        case AutoRefillStatus.Inactive:
          return true;
          break;
        case AutoRefillStatus.Pending:
          return false;
          break;
        case AutoRefillStatus.Unsubscribed:
          return true;
          break;
        default:
          return true;
          break;
      }
    }
    return true;
  }

  isDisplayAutorefillInfo() {
    if (this.autorefill.Status !== null) {
      return true;
    }
    return false;
  }

  isAutorefillActive() {
    return this.autorefill.Status === AutoRefillStatus.Active;
  }

  getAutorefillStatusText() {
    if (this.autorefill.Status !== null) {
      switch (this.autorefill.Status) {
        case AutoRefillStatus.Active:
          return 'Enabled';
        case AutoRefillStatus.Blocked:
          return 'Blocked';
        case AutoRefillStatus.Inactive:
          return 'InActive';
        case AutoRefillStatus.Pending:
          return false;
        case AutoRefillStatus.Unsubscribed:
        default:
          return '';
      }
      return '';
    }
  }


  loadBillingInfo(): void {
    this.customerService.GetBillingInfo().subscribe(
      (res: any) => { this.billingInfo = res; },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  cardBillingAddress(data, card) {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      width: '600px',
      data: {
        result: data,
        cardFull:card,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => {
      if (result == "success") {
        this.loadBillingInfo();
        this.customerService.getSavedCreditCards().subscribe(
          (data: CreditCard[]) => { this.creditCards = data; this.cardCount = data.length; },
          (err: ApiErrorResponse) => console.log(err),
        )
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

  addCardPopup() {
    if (this.cardCount < 3)
      this.cardBillingAddress(null, null);
    else
      this.razaSnackbarService.openError("Only 3 cards allowed, Please delete old card and try again.");
  }

  editCardDetails(card) {
    this.customerService.EditCreditCard(card).subscribe(data => {
      this.cardBillingAddress(data, card);
       
    });
  }

  deleteCardDetails(card) {
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        success: 'success',
        message:'Are you sure?',
        heading:'Delete card details'
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == "success") {
        this.customerService.DeleteCreditCard(card.CardId).subscribe(
          (res: boolean) => {
            if (res) {
              this.razaSnackbarService.openSuccess("Credit card deleted successfully.");
              this.customerService.getSavedCreditCards().subscribe(
                (data: CreditCard[]) => { this.creditCards = data; this.cardCount = data.length; },
                (err: ApiErrorResponse) => console.log(err),
              )
            }
            else
              this.razaSnackbarService.openError("Unable to delete information, Please try again.");
          },
          err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
        )
      }
    });
  }

}
