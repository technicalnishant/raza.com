import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { OneTouchNumber } from '../../models/onetouchNumber';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { PlanService } from '../../services/planService';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { ConfirmPopupDialog } from '../../dialog/confirm-popup/confirm-popup-dialog';
import { AddOnetouchSetupDialog } from '../../dialog/add-Onetouch-setups/add-onetouch-setup-dialog';
import { EditOnetouchSetupComponent } from '../../dialog/edit-onetouch-setup/edit-onetouch-setup.component';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { BillingInfo } from '../../models/billingInfo';

@Component({
  selector: 'app-account-one-touch',
  templateUrl: './account-one-touch.component.html',
  styleUrls: ['./account-one-touch.component.scss']
})
export class AccountOneTouchComponent implements OnInit {
  planId: string;
  onetouchNumbers: OneTouchNumber[];
  billingInfo: BillingInfo;
  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private razaSnackbarService: RazaSnackBarService,
    private titleService: Title,
    private razalayoutService: RazaLayoutService,
  ) {
    this.planId = this.route.snapshot.paramMap.get('planId');
  }

  
  ngOnInit() {
    this.titleService.setTitle('One Touch ');
    this.razalayoutService.setFixedHeader(true);
    this.loadOneTouchNumbers();
    
  }

  loadBillingInfo() {
    this.customerService.GetBillingInfo().subscribe(
      (res: BillingInfo) => {
        this.billingInfo = res;
      })
  }
  loadOneTouchNumbers() {
    this.planService.getOneTouchNumbers(this.planId).subscribe(
      (data: OneTouchNumber[]) => {
        this.onetouchNumbers = data;
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }


  deleteOneTouch(item: OneTouchNumber) {
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        success: "success",
        message:'Are you sure?',
        heading:'Delete one touch dial'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let body = {
        OneTouchNumber: item.HotDialNumber,
        DeletedBy: 'test',
      }

      if (result == "success") {
        this.customerService.deleteOneTouchSetUp(this.planId, body).subscribe(
          (res: boolean) => {
            if (res) {
              this.planService.getOneTouchNumbers(this.planId).subscribe(
                (data: OneTouchNumber[]) => this.onetouchNumbers = data,
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

  addNewTouch() {
    const dialogRef = this.dialog.open(AddOnetouchSetupDialog,
      {
        data: {
          pin: this.planId,
          oneTouchSeup: null
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "success") {
        this.loadOneTouchNumbers();
      }
    });

  }

  editOneTouchSetup(setup: OneTouchNumber) {
    const dialogRef = this.dialog.open(EditOnetouchSetupComponent,
      {
        data: {
          pin: this.planId,
          oneTouchSetup: setup
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "success") {
        this.loadOneTouchNumbers();
      }
    });
  }
}
