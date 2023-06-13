import { Component, OnInit, Input } from '@angular/core';
import { CurrentSetting } from 'app/core/models/current-setting';
import { SearchRatesService } from 'app/rates/searchrates.service';
import { Plan } from '../../models/plan';
@Component({
  selector: 'app-account-recharge',
  templateUrl: './account-recharge.component.html',
  styleUrls: ['./account-recharge.component.scss']
})
export class AccountRechargeComponent implements OnInit {
  @Input() plan: Plan;
  currentSetting: CurrentSetting;
  callingFrom : any;
  callingTo : any;

  constructor(
    private searchRatesService: SearchRatesService,
  ) { }

  ngOnInit(): void {

    this.callingFrom = this.plan.CountryFrom;
    this.callingTo = this.plan.CountryTo;

    this.getRates();
  }
  

   
    getRates()
    {
      this.searchRatesService.getSearchGlobalRates(this.callingFrom, this.callingTo).subscribe(
        (data: any) => {  })
   }
}
