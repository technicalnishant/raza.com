import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RazaSnackBarService } from '../../../../shared/razaSnackbar.service';
import { pinlessNumber } from '../../../../accounts/models/pinlessNumber';
import { PlanService } from '../../../../accounts/services/planService';
import { NewPlanCheckoutModel } from '../../../models/checkout-model';
import { ActivatedRoute, Router } from '@angular/router';
//import { isNullOrUndefined } from 'util';
import { CheckoutService } from '../../../services/checkout.service';
import { RazaLayoutService } from '../../../../core/services/raza-layout.service';
import { isNullOrUndefined } from "../../../../shared/utilities";
import { AuthenticationService } from "../../../../core/services/auth.service";
import { ErrorDialogComponent } from 'app/shared/dialog/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogModel } from 'app/shared/model/error-dialog.model';
@Component({
  selector: 'app-pinless-switch',
  templateUrl: './pinless-switch.component.html',
  styleUrls: ['./pinless-switch.component.scss']
})
export class PinlessSwitchComponent implements OnInit {
  @ViewChild('selList',{static: true}) list: MatSelectionList;
  newPinFormGroup: FormGroup;
  currentCart: NewPlanCheckoutModel;
  isShowMore: boolean = true;
  constructor(
    private fb: FormBuilder,
    private snackBarService: RazaSnackBarService,
    private planService: PlanService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private checkoutService: CheckoutService,
    private razaLayoutService: RazaLayoutService,
    private authService: AuthenticationService,
  ) { }

  allPinlessNumbers: string[] = [];
  pinlessNumbers: string[] = [];

  newPinlessNumber: string[] = [];
  switchPinlessNumber: string[] = [];

  ngOnInit() {
    this.currentCart = this.route.parent.snapshot.data['cart'];
    this.razaLayoutService.setFixedHeader(true);

    this.planService.getPinlessNumbersByCustomerId()
      .subscribe((res: pinlessNumber[]) => {
        res.map(a => { this.allPinlessNumbers.push(a.PinlessNumber) });
        this.pinlessNumbers = this.allPinlessNumbers.slice(0, 3);
      })

    this.newPinFormGroup = this.fb.group({
      numbers: this.fb.array([])
    });

    this.addNew();
    //this.checkNew();/****** on 26th may 2022 we comment this to check fretrial for existing customer******/
  }
  checkNew()
  {
    var userInfo = this.authService.getCurrentLoginUser();
    if( this.currentCart.couponCode == "BUY1GET1" && userInfo.isnew == false)
    {
      this.router.navigate(['/account/overview']);
      let error = new ErrorDialogModel();
              error.header = 'Invalid Coupon Code';
              error.message = 'This offer is available for New customers only. Kindly recharge your account or call customer service for assistance. Thank you!';
              this.openErrorDialog(error);
      //this.snackBarService.openWarning("This offer is available for New customers only. Kindly recharge your account or call customer service for assistance. Thank you!");
    }
  }

  openErrorDialog(error: ErrorDialogModel): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { error }
    });
  }
  
  get newPinFormArray() {
    return this.newPinFormGroup.get('numbers') as FormArray;
  }

  toggleShowAllNumbers() {
    if (this.isShowMore) {
      this.pinlessNumbers = this.allPinlessNumbers;
      this.isShowMore = false;
    } else {
      this.pinlessNumbers = this.allPinlessNumbers.slice(0, 3);
      this.isShowMore = true;
    }
  }

  addNew() {

    const len = (this.newPinFormGroup.get('numbers') as FormArray).controls.length;
    const selLen = this.list.selectedOptions.selected.length;
    if ((len + selLen) < 5) {
      (this.newPinFormGroup.get('numbers') as FormArray).push(this.fb.group({
        pinlessNumber: []
      }));
    } else {
      this.snackBarService.openError('A Maximum of 5 pinless numbers can be registered.')
    }
  }

  saveNumbers() {

    const allNumbers: string[] = [];
    this.list.selectedOptions.selected.map(num => {
      allNumbers.push(num.value);
    });

    const formsNumbers: any[] = this.newPinFormGroup.value.numbers;

    if (!isNullOrUndefined(formsNumbers)) {
      formsNumbers.map(a => {
        if (!isNullOrUndefined(a.pinlessNumber)) {
          allNumbers.push(a.pinlessNumber)
        }
      })
    }

    if (allNumbers.length === 0) {
      this.snackBarService.openError('Please enter a number to proceed.')

    }
    this.currentCart.pinlessNumbers = allNumbers;
    this.checkoutService.setCurrentCart(this.currentCart);
    this.router.navigate(['/checkout/payment-info'])

  }

}
