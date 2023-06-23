import { Component, OnInit,Input } from '@angular/core';
import { Plan } from 'app/accounts/models/plan';
import { CurrentSetting } from 'app/core/models/current-setting';
import { SearchRatesService } from 'app/rates/searchrates.service';

@Component({
  selector: 'app-account-recharge',
  templateUrl: './account-recharge.component.html',
  styleUrls: ['./account-recharge.component.scss']
})
export class AccountRechargeComponent implements OnInit {
  @Input() plan: Plan;
  currentSetting: CurrentSetting;
  phoneNumber:any;
  toCountryId:number;
  fromCountryId:number;
  denominatons:any;
  isAutorefill:boolean=false;
  constructor(
    private searchRatesService: SearchRatesService,
  ) { }

  ngOnInit(): void {
    this.phoneNumber    = localStorage.getItem("login_no");
    this.toCountryId    = this.plan.CountryTo;
    this.fromCountryId  = this.plan.CountryFrom;
    this.getRates();
  }
  

   
    getRates()
    {
      this.searchRatesService.getSpecificRateDetails(this.fromCountryId, this.toCountryId, this.phoneNumber).subscribe(
        (data: any) => {
          if( data )
          this.filterDenomination(data);
           
        })
   }
   filterDenomination(data:any)
   {
      this.denominatons = data[0];//.filter( a => {a.CountryId == this.fromCountryId})
   }

   setPlanType()
   {
     
     this.isAutorefill = !this.isAutorefill;
   
      
    // this.clickSliderButton(current_position)
   }

   onClickAmountOption(item)
   {

   }
}
