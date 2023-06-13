import { Component, OnInit } from '@angular/core';
import { CurrentSetting } from 'app/core/models/current-setting';
import { SearchRatesService } from 'app/rates/searchrates.service';

@Component({
  selector: 'app-account-recharge',
  templateUrl: './account-recharge.component.html',
  styleUrls: ['./account-recharge.component.scss']
})
export class AccountRechargeComponent implements OnInit {

  currentSetting: CurrentSetting;
  constructor(
    private searchRatesService: SearchRatesService,
  ) { }

  ngOnInit(): void {
    this.getRates();
  }
  

   
    getRates()
    {
      // this.searchRatesService.getSearchGlobalRates(this.currentSetting.currentCountryId, this.countryId).subscribe(
      //   (data: any) => {})
   }
}
