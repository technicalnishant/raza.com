import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { PlanService } from '../../services/planService';
import { CallForwardingSetup } from '../../models/callForwardingSetup';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { AddCallForwardDialog } from '../../dialog/add-call-forward-dialog/add-call-forward-dialog';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { ConfirmPopupDialog } from '../../dialog/confirm-popup/confirm-popup-dialog';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { Plan } from 'app/accounts/models/plan';

@Component({
  selector: 'app-mobile-call-farwording',
  templateUrl: './mobile-call-farwording.component.html',
  styleUrls: ['./mobile-call-farwording.component.scss']
})
export class MobileCallFarwordingComponent implements OnInit {
  id: any = 1;
  dealselected: any = 1;
  planId: string;
  @Input() plan: Plan;
  constructor(
    private route: ActivatedRoute, private planService: PlanService, private titleService: Title,
    private dialog: MatDialog, private razaSnackbarService: RazaSnackBarService,
    private razalayoutService: RazaLayoutService
  ) {

     

  }

  callForwardingSetupList: CallForwardingSetup[] = [];
  ngOnInit() {
    this.razalayoutService.setFixedHeader(true);
    

     
          this.planId = this.plan.PlanId;
          this.loadCallForwarding();
        

    this.titleService.setTitle('Call Forwarding');
  }

  loadCallForwarding() {
    this.planService.getCallForwardingSetups(this.planId).subscribe(
      (data: CallForwardingSetup[]) => { this.callForwardingSetupList = data; },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  deleteCallForwarding(item) {
    //  console.log('item', item);
    const dialogRef = this.dialog.open(ConfirmPopupDialog, {
      data: {
        success: 'success'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == "success") {
        this.planService.deleteCallForwardingSetups(this.planId, item.SetupId).subscribe(
          (res: boolean) => {
            if (res) {
              this.razaSnackbarService.openSuccess("Call forwarding setup deleted successfully.");
              this.loadCallForwarding();
            }
            else
              this.razaSnackbarService.openError("Unable to delete information, Please try again.");
          },
          err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
        )
      }
    });
  }

  setUpCallForward() {
    const callforwarding = this.dialog.open(AddCallForwardDialog, {
      data: {
        plan: this.planId
      }
    });

    callforwarding.afterClosed().subscribe(result => {
      if (result == "success") {
        this.loadCallForwarding();
      }
    },
      err => this.razaSnackbarService.openError("An error occurred!! Please try again.")
    )
  }

}

