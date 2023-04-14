import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../payments/services/transaction.service';
import { ValidateCouponCodeResponseModel, ValidateCouponCodeRequestModel } from '../../../payments/models/validate-couponcode-request.model';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { ICheckoutModel } from '../../models/checkout-model';

@Component({
  selector: 'app-redeem-promo',
  templateUrl: './redeem-promo.component.html',
  styleUrls: ['./redeem-promo.component.scss']
})
export class RedeemPromoComponent implements OnInit {

  redeemPromoForm: FormGroup;
  currentCart: ICheckoutModel;

  constructor(
    public dialogRef: MatDialogRef<RedeemPromoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private transactionService: TransactionService
  ) { }

  ngOnInit() {
    this.currentCart = this.data.cart;

    this.redeemPromoForm = this.formBuilder.group({
      couponCode: ['', [Validators.required]],
    });
  }


  closeIcon(): void {
    this.dialogRef.close();
  }


  // Validate coupon code.
  validateCoupon(couponCode: string): Promise<ValidateCouponCodeResponseModel | ApiErrorResponse> {
    return this.transactionService.validateCouponCode(this.currentCart.getValidateCouponCodeReqModel(couponCode)).toPromise();
  }

  redeemPromoFormSubmit() {
    if (!this.redeemPromoForm.valid) {
      return;
    }

    this.validateCoupon(this.redeemPromoForm.value.couponCode)
      .then((res: ValidateCouponCodeResponseModel) => {
        if (res.Status) {
          this.dialogRef.close(this.redeemPromoForm.value.couponCode);
        } else {
          this.redeemPromoForm.controls['couponCode'].setErrors({ 'invalid': true });
        }
      }).catch(a => {
        this.redeemPromoForm.controls['couponCode'].setErrors({ 'invalid': true });
      });

  }

}
