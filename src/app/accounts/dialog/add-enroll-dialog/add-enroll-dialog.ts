import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomerService } from "../../services/customerService";
import { CountriesService } from '../../../core/services/country.service';
import { RazaSnackBarService } from "../../../shared/razaSnackbar.service";
import { ApiErrorResponse } from "../../../core/models/ApiErrorResponse";
import { RechargeService } from "../../../recharge/services/recharge.Service";
import { AutoRefill } from "../../models/autorefill";
import { CreditCard } from "../../models/creditCard";
import { MatDialog } from '@angular/material/dialog';
//import { CreditCard } from "../../models/profileSnapshot";
import { AddCreditcardDialog } from '../add-creditcard-dialog/add-creditcard-dialog';
import { State, BillingInfo } from '../../models/billingInfo';
import { Router } from '@angular/router';
@Component({
  selector: 'add-enroll-dialog',
  templateUrl: './add-enroll-dialog.html',
  styleUrls: ['./add-enroll-dialog.scss']
})
export class AddEnrollDialog implements OnInit {
  creditCardList: CreditCard[];
  planId: string;
  rechargeAmounts: number[];
  autoRefillForm: FormGroup;
  autorefillSetup: AutoRefill;
  submitted = false;
  billingInfo: BillingInfo;
  headerPromotion : boolean = false;
  username:string='';
  states: State[] = [];
  isAutorefill = true;
  viewAllrate = false;
  viewAllPlan = false;
  nextScreen = false;
  nextFirst = true;
  addCreditCard = false;
  isAgreeToAutorefill:boolean = false;
  amount:any=20;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AddEnrollDialog>,
    private _formBuilder: FormBuilder,
    private razaSnackBarService: RazaSnackBarService,
    private customerService: CustomerService,
    private countryService: CountriesService,
    private rechargeService: RechargeService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.planId = data.planId;
    this.autorefillSetup = this.data.autorefillSetup;
    if(this.data.header && this.data.header == 'promotion')
    {
      this.headerPromotion = true;
    }

    if(this.data.username && this.data.username != '')
    {
      this.username = this.data.username;
    }

  }

  ngOnInit() {

    this.autoRefillForm = this._formBuilder.group({
      planName: [{ value: this.autorefillSetup.PlanName, disabled: true }],
      CreditCard: ['', Validators.required],
      AutoRefillAmount: ['', Validators.required],
      isAgreeToAutorefill: [false, Validators.requiredTrue]
    });


    this.autoRefillForm.controls["isAgreeToAutorefill"].setValue(true);
    this.getCustomerCreditCard();

    if (this.data.isEdit) {
      this.autoRefillForm.patchValue({
        CreditCard: this.autorefillSetup.CardNumber,
        AutoRefillAmount: this.autorefillSetup.AutoRefillAmount.toString()
      });
    }
    this.getBillingInfo();

    this.setAutoRefillAmount();
  }
  setAutoRefillAmount() {
    this.autoRefillForm.get('AutoRefillAmount').setValue(this.amount);
  }
  getBillingInfo() {
    this.customerService.GetBillingInfo().toPromise().then(
      (res: BillingInfo) => {
        if (res.Address) {
          this.onCountryChange(res.Address.Country.CountryId)
        }
        const billInfo = {
          firstName: res.FirstName,
          lastName: res.LastName,
          address: res.Address.StreetAddress,
          zipcode: res.Address.ZipCode,
          city: res.Address.City,
          country: res.Address.Country.CountryId,
          state: res.Address.State,
          phoneNumber: res.Address.HomePhone,
        };
        this.billingInfo = res;
       // this.paymentInfoForm.patchValue(billInfo);
      })
  }
  onCountryChange(country: number): void {
    this.countryService.getStates(country).subscribe(
      (res: State[]) => {
        this.states = res;
      }
    )
  }
  
  closeIcon(): void {
    this.dialogRef.close();
  }

  getCustomerCreditCard() {
    this.customerService.getSavedCreditCards().subscribe(
      (data: CreditCard[]) => { 
        this.creditCardList = data; 
        if(data[0])
        this.autoRefillForm.controls['CreditCard'].setValue(data[0].CardId);
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  getRechargeOption() {
    this.rechargeService.getRechargeAmounts(161).subscribe(
      (res: number[]) => {
        this.rechargeAmounts = res;
      }
    )
  }
  processAutorefill(body): void {
    this.customerService.postAutoRefill(this.planId, body).subscribe(
      (res: boolean) => {
        if (res) {
          this.razaSnackBarService.openSuccess("Auto-refill enrolled successfully.");
          this.dialogRef.close('success');
          this.router.navigate(['./account/autorefill/'+this.planId]);
        }
        else
          this.razaSnackBarService.openError("Unable to save information, Please try again.");
      },
      err => this.razaSnackBarService.openError("An error occurred!! Please try again.")
    )
  }
  autoRefillFormSubmit(): void {
     
    this.submitted=true;

    let body = {
      CreditCardId: this.autoRefillForm.get('CreditCard').value,
      Amount: this.autoRefillForm.get('AutoRefillAmount').value
    }
      
 
    if (!this.autoRefillForm.valid)
      return;
 

      this.processAutorefill(body);

    
  }

  getCustomerCards() {
    this.customerService.getSavedCreditCards().subscribe(
      (data: CreditCard[]) => { this.creditCardList = data; 
         if(data[0])
        this.autoRefillForm.controls['CreditCard'].setValue(data[0].CardId);
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }


  getCustomerCardsAuto() {
    this.customerService.getSavedCreditCards().subscribe(
      (data: CreditCard[]) => { this.creditCardList = data; 
         if(data[0])
         {
          this.autoRefillForm.controls["isAgreeToAutorefill"].setValue(true);
          this.autoRefillForm.controls['CreditCard'].setValue(data[0].CardId);
           
          let body = {
            CreditCardId: this.autoRefillForm.get('CreditCard').value,
            Amount: this.autoRefillForm.get('AutoRefillAmount').value
          }
            
          this.processAutorefill(body);
         }
        
      },
      (err: ApiErrorResponse) => console.log(err),
    )
  }

  addNewCard() {
    const dialogRefCard = this.dialog.open(AddCreditcardDialog, {
      maxHeight: '550px',
      maxWidth: '550px',
      data: {
        result: null,
        result2: this.billingInfo
      }
    });

    dialogRefCard.afterClosed().subscribe(result => { 
      if (result.split(",")[0] == "success") {}
        this.getCustomerCardsAuto(); 
      
    },
      err => this.razaSnackBarService.openError("An error occurred!! Please try again.")
    )

  }



  getSelectedClass(amt:any)
{
  if(this.amount == amt)
  {
    return 'selected';
  }
  else{
    return '';
  }
}
getChecked(amt:any)
{
  if(this.amount == amt)
  {
    return true;
  }
  else{
    return false;
  }
}
 
onClickAmountOption(amt:number)
{
  this.amount = amt;
  this.setAutoRefillAmount();
}


gotToNextScreen = () => {

  if(this.autoRefillForm.get('isAgreeToAutorefill').value )
  {
    this.isAgreeToAutorefill =false
    this.nextFirst = false;
    this.nextScreen = true;
  }
  else
  {
    this.isAgreeToAutorefill =true;
 
  }
    
}

gotToBackScreen = () =>
{
  this.nextScreen = false;
  this.nextFirst = true;
}
}