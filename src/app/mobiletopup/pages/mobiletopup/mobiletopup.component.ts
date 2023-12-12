import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { isNullOrUndefined } from 'util';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Country } from '../../../shared/model/country';
import { mobileTopupModel } from '../../model/mobileTopupModel';
import { OperatorDenominations } from '../../model/operatorDenominations';
import { CountriesService } from '../../../core/services/country.service';
import { MobiletopupService } from '../../mobiletopup.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { SideBarService } from '../../../core/sidemenu/sidemenu.service';
import { TransactionType } from '../../../payments/models/transaction-request.model';
import { CheckoutService } from '../../../checkout/services/checkout.service';
import { MobileTopupCheckoutModel } from '../../../checkout/models/checkout-model';
import { AuthenticationService } from '../../../core/services/auth.service';
import { RazaEnvironmentService } from '../../../core/services/razaEnvironment.service';
import { CurrentSetting } from '../../../core/models/current-setting';
import { isNullOrUndefined } from "../../../shared/utilities";
import { Location } from '@angular/common';
import { MetaTagsService } from 'app/core/services/meta.service';
import { PreviousRouteService } from 'app/core/services/previous-route.service';
@Component({
  selector: 'app-mobiletopup',
  templateUrl: './mobiletopup.component.html',
  styleUrls: ['./mobiletopup.component.scss']
})
export class MobiletopupComponent implements OnInit, OnDestroy {

  allCountry: Country[];
  mycountryName: string;
  mycountryId: number;
  filteredCountry: Observable<Country[]>;
  // autoControl = new FormControl();
  mobileTopupData: mobileTopupModel;
  operatorDenominations: OperatorDenominations[];
  mobileTopupForm: FormGroup;
  amountSent: number;
  countryName:String;
  countrySelect = new FormControl();
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  isTopUpEnable: boolean = false;
  pinnumber:number;
  topup_no:string;
  iso:string;
  showOperators:boolean=false;
  operatorsList:any=[];
  countryTo:number=0;
  currentOperator:string='';
  topup_ctr: any;
  constructor(private router: Router, private titleService: Title,
    private formBuilder: FormBuilder,
    private countryService: CountriesService,
    private sideBarService: SideBarService,
    private mobileTopupService: MobiletopupService,
    private checkoutService: CheckoutService,
    private authService: AuthenticationService,
    private razaEnvService: RazaEnvironmentService,
	private location:Location,
  private metaTagsService:MetaTagsService,
  private previousRouteService: PreviousRouteService,
  ) {

  }

  ngOnInit() {

    let previous = this.previousRouteService.getPreviousUrl();
    let currnet = this.previousRouteService.getCurrentUrl();
 
     
    
    this.titleService.setTitle('Mobile Topup');
    this.metaTagsService.getMetaTagsData('mobiletopup');
    this.sideBarService.toggle();
    this.getCountries();
	this.mycountryId = 0;
    this.mobileTopupForm = this.formBuilder.group({
      countryTo: ['', [Validators.required]],
      phoneNumber: ['', Validators.required],
      topUpAmount: [null]
    });

    this.mobileTopupForm.get('countryTo').valueChanges.subscribe(res => {
      this.changeNumber();
    });

    this.filteredCountry = this.mobileTopupForm.get('countryTo').valueChanges
      .pipe(
        startWith<string | Country>(''),
        map(value => typeof value === 'string' ? value : value.CountryName),
        map(CountryName => CountryName ? this._filter(CountryName) : this.allCountry)
      );

    this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      
    });
	  
	  this.pinnumber = (history.state.pin)?history.state.pin:'';
    this.topup_no = (history.state.pin)?history.state.pin:'';
    this.iso = (history.state.iso)?history.state.iso:'';
    if( this.pinnumber >0 )
    {
      this.mobileTopupForm.controls["phoneNumber"].setValue(this.pinnumber);
      this.getInitialTopUpOperatorInfo();
      this.isTopUpEnable = true;  
    }

   
    // localStorage.getItem("topupCountryName");
    // localStorage.getItem("topupPhone");

    if(parseFloat(localStorage.getItem("topupCountryId")) > 0)
    {
 
      let json_str            = JSON.parse(localStorage.getItem("topupCountry"));
      this.mycountryId        = json_str.CountryId; 
      
      if(this.mycountryId > 0)
      {

        this.mobileTopupForm.controls["countryTo"].setValue(json_str);
        this.countryName        = json_str.CountryName;
        this.topup_ctr          = parseFloat(localStorage.getItem("topupCountryId"));
        
  
        
        
        this.mobileTopupForm.controls["phoneNumber"].setValue(parseFloat(localStorage.getItem("topupPhone")))
  
       if(localStorage.getItem("topupTrigger") == 'clicked')
       {
        this.getTopUpOperatorInfo();
       }
        
      }
     

    }
    
     

     
  }

  ngOnDestroy(): void {
    this.currentSetting$.unsubscribe();
  }

  private getCountries() {
    this.countryService.getAllCountries().subscribe(
      (data: Country[]) => {
        this.allCountry = data;
        if(this.iso !='')
        {
          for (let i = 0; i < data.length; i++) {
           /* if(data[i].iso == this.iso)
           {
            this.onSelectCountrFrom(data[i]);
           }*/
          }
        }
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }


  getInitialTopUpOperatorInfo() {
     
     
    let phoneNumberWithCode: number = this.pinnumber;
    
    this.mobileTopupService.GetMobileTopUp(this.currentSetting.currentCountryId, phoneNumberWithCode).subscribe(
      (data: mobileTopupModel) => {
        console.log("step 1");
        
        if(data && data.OperatorDenominations && data.OperatorDenominations[1])
        {
          this.operatorsList = data.AvaliableOperators;
         // console.log("step 2");
            for (let i = 0; i < this.allCountry.length; i++) 
            {
              if(this.allCountry[i].CountryId ==  data.CountryId)
              {
               // console.log("step 3");
                 
                  this.onSelectCountrFrom(this.allCountry[i]);
                  
                  var length = this.allCountry[i].CountryCode.length;
                  var phone =   parseFloat(this.topup_no.substring(length));
                  //console.log(this.topup_no);
                 // console.log(phone);
                 this.isTopUpEnable = true;
                  this.onClickAmountOption(data.OperatorDenominations[1]);
                  this.mobileTopupForm.patchValue({countryTo:this.allCountry[i] });
                  this.mobileTopupForm.patchValue({ phoneNumber:phone});
                 
                  this.mobileTopupData = data;
                   
              }
          }
          
           
        }
        else
        { 
          this.isTopUpEnable = true;  
        }
      },
      (err: ApiErrorResponse) => {
        console.log(err)
        
      
      },
    );
  }


  radioChange(event) {
    this.amountSent = event.value;
  }

  displayFn(country?: Country): string | undefined {
     console.log("you are here", country);
    return country ? country.CountryName : undefined;
  }

  private _filter(value: any): Country[] {
    const filterValue = value.toLowerCase();
    return this.allCountry.filter(option => option.CountryName.toLowerCase().indexOf(filterValue) === 0);
  }

  changeNumber() {
    this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
    this.mobileTopupForm.get('phoneNumber').enable();

    this.mobileTopupForm.patchValue({
      phoneNumber: '',
      topUpAmount: null
    });

    this.mobileTopupData = null;
   this.isTopUpEnable = false;
  }
  changeCountry() {
    this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
    this.mobileTopupForm.get('phoneNumber').enable();

    this.mobileTopupForm.patchValue({
      phoneNumber: '',
      countryTo:'',
      topUpAmount: null
    });

    this.mobileTopupData = null;
     this.isTopUpEnable = false;
  }
  getTopUpOperatorInfo() {
    if (!this.mobileTopupForm.valid) {
      return;
    }

    const formValue = this.mobileTopupForm.value;

    const country: Country = formValue.countryTo;
    let phoneNumberWithCode: string = country.CountryCode + formValue.phoneNumber;
    this.mobileTopupService.GetMobileTopUp(this.currentSetting.currentCountryId, phoneNumberWithCode).subscribe(
      (data: mobileTopupModel) => {
        if (isNullOrUndefined(data)) {
          this.mobileTopupForm.get('phoneNumber').setErrors({ Invalid_Operator: true })
          return;
        }
        this.operatorsList = data.AvaliableOperators;
        this.countryTo = data.CountryId;
        this.mobileTopupData = data;
        this.currentOperator = data.Operator;
        this.onClickAmountOption(this.mobileTopupData.OperatorDenominations[1]) ;
        this.isTopUpEnable = true;
        this.mobileTopupForm.get('topUpAmount').updateValueAndValidity();
        this.mobileTopupForm.get('phoneNumber').disable();
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  
  get operatorImage() {
    return `assets/images/operators/${this.mobileTopupData.Operator.toLowerCase()}.png`;
  }

  get buttonText() {
    if (!this.isTopUpEnable) {
      return 'Submit';
    } else {
      return 'Checkout';
    }
  }
  getChecked(amt:number)
  {
    if(this.mobileTopupForm.get('topUpAmount').value)
    {
      if( amt == this.mobileTopupForm.get('topUpAmount').value.UsDenomination)
      {
        return 'selected';
      }
      else{
        return '';
      }
    }
  else
    return false;
  }
  onClickAmountOption(item: any) {
    
    this.mobileTopupForm.get('topUpAmount').setValue(item);
    this.isTopUpEnable = true;
  }
  onMobileTopupFormSubmit() {
    // stop here if form is invalid
    if (!this.isTopUpEnable) {
      localStorage.setItem("topupTrigger", 'clicked');
      this.getTopUpOperatorInfo();
      return;
    }

    this.validateAmountSelection();
    if (!this.mobileTopupForm.valid) {
      return;
    }

    const checkoutModel: MobileTopupCheckoutModel = new MobileTopupCheckoutModel();

    checkoutModel.transactiontype = TransactionType.Topup;
    checkoutModel.country = this.mobileTopupForm.get('countryTo').value as Country; // this.autoControl.value.countryTo as Country;
    checkoutModel.topupOption = this.mobileTopupForm.value.topUpAmount as OperatorDenominations;
    checkoutModel.currencyCode = this.currentSetting.currency;
    //checkoutModel.phoneNumber = this.mobileTopupForm.get("countryTo").value?.CountryCode+' '+this.mobileTopupForm.get('phoneNumber').value;
    checkoutModel.phoneNumber = this.mobileTopupForm.get('phoneNumber').value;
    checkoutModel.operatorCode = this.mobileTopupData.OperatorCode;
    checkoutModel.countryFrom = this.currentSetting.currentCountryId;
    checkoutModel.isHideCouponEdit = true;

    this.checkoutService.setCurrentCart(checkoutModel);

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['checkout/payment-info']);
    } else {
      this.router.navigate(['checkout']);
    }
  }

  validateAmountSelection() {
    if (!this.isTopUpEnable) {
      return false;
    }
    const amount = this.mobileTopupForm.get('topUpAmount').value;
    if (isNullOrUndefined(amount)) {
      this.mobileTopupForm.get('topUpAmount').setErrors({ Amount_Req: true })
      return false
    }

    return true;
  }
  
 
  onSelectCountrFrom(country: Country) 
  {
   
    localStorage.setItem("topupCountryId", country.CountryId.toString());
    localStorage.setItem("topupCountry", JSON.stringify(country));
    
    
    this.countryName = country.CountryName;
    this.mycountryId= country.CountryId; 
  } 
  storePhoneNumber = () =>{
    let phone = this.mobileTopupForm.get('phoneNumber').value;
    localStorage.setItem("topupPhone", phone);
   
  }
  unsetFlag() {
    
    
	this.mycountryId= -1; 
  }
  
  setOperator(obj)
  {
    this.mobileTopupData.Operator = obj;
    this.showOperators = false;
    this.currentOperator = obj;
    this.getOperatorDenominations();
  }
  get_optr_image(obj)
  {
    return `assets/images/operators/${obj.toLowerCase()}.png`;
  }

  changeOperator()
  {
    this.showOperators = true;
  }
  getOperatorDenominations()
  {
    this.mobileTopupService.getOperatorsDenomination(this.currentSetting.currentCountryId, this.countryTo, this.currentOperator).subscribe(  (data: any) =>{
      if(data)
      {
        this.mobileTopupData.OperatorDenominations = data;
        this.onClickAmountOption(this.mobileTopupData.OperatorDenominations[1]) ;
      }
      
    })
  }
}
