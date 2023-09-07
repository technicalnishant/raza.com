import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CustomerService } from '../../services/customerService';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { PlanService } from '../../services/planService';
import { pinlessNumber } from '../../models/pinlessNumber';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { ConfirmPopupDialog } from '../../dialog/confirm-popup/confirm-popup-dialog';
import { AddPinlessSetupDialog } from '../../dialog/add-pinless-setup/add-pinless-setup-dialog';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-my-number',
  templateUrl: './account-my-number.component.html',
  styleUrls: ['./account-my-number.component.scss']
})
export class AccountMyNumberComponent implements OnInit {
  id: any = 1;
  planId: string;
  pinlessNumbers: pinlessNumber[];
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;

  constructor(
    // public dialogRef: MatDialogRef<AccountMyNumberComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute, private dialog: MatDialog, private planService: PlanService,
    private customerService: CustomerService,
    private razaSnackbarService: RazaSnackBarService,
    private titleService: Title,
    private razalayoutService: RazaLayoutService,
    private razaEnvService: RazaEnvironmentService
  ) {
    //if (isNullOrUndefined(data))
    this.planId = this.route.snapshot.paramMap.get('planId');
    // else
    //   this.pin = data;
  }

  ngOnInit() {
    this.titleService.setTitle('My Number');
    this.razalayoutService.setFixedHeader(true);
    this.planService.getPinlessNumbers(this.planId).subscribe(
      (data: pinlessNumber[]) => { this.pinlessNumbers = data; },
      (err: ApiErrorResponse) => console.log(err),
    );

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
    });
  }

  deletePinLess(item) {
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        success: 'success',
        message:'Are you absolutely certain you wish to remove this number?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      let body = {
        PinlessNumber: item.PinlessNumber,
        CountryCode: item.CountryCode,
      }
      if (result == "success") {
        this.customerService.DeletePinLess(this.planId, body).subscribe(
          (res: boolean) => {
            if (res) {
              this.razaSnackbarService.openSuccess("Pin-Less set up deleted successfully.");
              this.customerService.getSavedPinLess(this.planId).subscribe(
                (data: pinlessNumber[]) => this.pinlessNumbers = data,
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

  addNumber() {
    const dialogPinless = this.dialog.open(AddPinlessSetupDialog,
      {
        data: {
          plan: this.planId,
          countryId: this.currentSetting.currentCountryId,
          result: null
        }
      });

    dialogPinless.afterClosed().subscribe(result => {

      if (result == "success") {
        this.planService.getPinlessNumbers(this.planId).subscribe(
          (data: pinlessNumber[]) => this.pinlessNumbers = data,
          (err: ApiErrorResponse) => console.log(err),
        )
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

}
