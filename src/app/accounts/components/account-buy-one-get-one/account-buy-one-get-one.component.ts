import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-account-buy-one-get-one',
  templateUrl: './account-buy-one-get-one.component.html',
  styleUrls: ['./account-buy-one-get-one.component.scss']
})
export class AccountBuyOneGetOneComponent implements OnInit {

  constructor(private router: Router,) { }
  isLoading:boolean = false;
  isOverview:boolean = true;
  ngOnInit() {

    //Loading All customer plans.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

    if(event.url == '/account/overview') {
      this.isOverview = true;
    }
    else if(event.url == '/account/my-profile' || event.url == '/account/rewards') {
      this.isOverview = false;
    }
    else {
      this.isOverview = false;
    }

    });
  }

  onClickRechargeButton()
  {
    this.isLoading = true;
    this.router.navigate(['deals/buy1-get1']);
  }
}
