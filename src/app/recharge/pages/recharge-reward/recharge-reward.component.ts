import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PlanService } from '../../../accounts/services/planService';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { Plan } from '../../../accounts/models/plan';
import { RechargeCheckoutModel } from '../../../checkout/models/checkout-model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { RechargeRewardService } from '../../services/recharge-reward.Service';
import { MatDialog } from '@angular/material/dialog';
import { RewardRedeemConfirmDialog } from '../../../accounts/dialog/reward-redeem-confirm/reward-redeem-confirm-dialog';
import { RazaSnackBarService } from '../../../shared/razaSnackbar.service';
import { exhaustMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recharge-reward',
  templateUrl: './recharge-reward.component.html',
  styleUrls: ['./recharge-reward.component.scss']
})
export class RechargeRewardComponent implements OnInit {
  id: any;
  rechargeOptions: any;
  planId: string
  plan: Plan;
  isAutoRefillEnable: boolean = false;
  enrollAmount: number;
  constructor(
    private razaSnackbarService: RazaSnackBarService,
    private route: ActivatedRoute,
    private titleService: Title,
    private planService: PlanService,
    private rechargeRewardService: RechargeRewardService,
    public dialog: MatDialog,
    private razaLayoutService: RazaLayoutService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Select recharge amount');
    this.razaLayoutService.setFixedHeader(true);

    this.rechargeRewardService.getRechargeOptions().subscribe(
      (res: any) => {
        this.rechargeOptions = res;
        this.enrollAmount=res.Options[0].Amount;
      },
      err => console.log(err)
    );

    this.planId = this.route.snapshot.paramMap.get('planId');
    this.planService.getPlan(this.planId).subscribe(
      (res: Plan) => this.plan = res,
      err => console.log(err)
    );

  }

  onClickAmountOption(points: number) {
    const dialogRef = this.dialog.open(RewardRedeemConfirmDialog);

    dialogRef.afterClosed().pipe(exhaustMap(res => {
      if (res) {
        return this.rechargeRewardService.redeemRewardRecharge(points)
      }
    }
    )).subscribe(result => {
      if (result) {
        this.router.navigate(['/account/overview']);
        this.razaSnackbarService.openSuccess("Recharge successfull.")
      }
    }, err => {
      console.log(err);
    });

  }

}




