import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CurrentSetting } from 'app/core/models/current-setting';
import { MetaTagsService } from 'app/core/services/meta.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-referafriend',
  templateUrl: './referafriend.component.html',
  styleUrls: ['./referafriend.component.scss']
})
export class ReferafriendComponent implements OnInit {

  mode = new FormControl('over');
  headerValue: number = 1;
  currentCurrency:any;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  // fillerNav = [ 'INTERNATIONAL CALLING' , 'MOBILE TOP-UP' , 'CALL ME LOCAL' , 'SIGNUP / LOGIN' , 'RECHARGE' , 'LIVE CHAT' , 'CONTACT US' ];

  constructor(private router: Router, private razaEnvService: RazaEnvironmentService, private titleService: Title, private metaTagsService:MetaTagsService) { }

  ngOnInit() {
    this.titleService.setTitle('Refer a friend'); 
    this.metaTagsService.getMetaTagsData('refer-a-friend');
    this.currenctSetting$ = this.razaEnvService.getCurrentSetting().subscribe(a => {
      this.currentSetting = a;
      console.log('Ga dsfasdf ads',this.currentSetting);
      this.setcurrentCurrency();
    });
  }
  setcurrentCurrency()
  {
    if(this.currentSetting.country.CountryId == 1)
      this.currentCurrency='USD';
      if(this.currentSetting.country.CountryId == 2)
      this.currentCurrency='CAD';
      if(this.currentSetting.country.CountryId == 3)
      this.currentCurrency='GBP';
      if(this.currentSetting.country.CountryId == 8)
      this.currentCurrency='AUD';
      if(this.currentSetting.country.CountryId == 20)
      this.currentCurrency='NZD';
      if(this.currentSetting.country.CountryId == 26)
      this.currentCurrency='INR';
  }

}
