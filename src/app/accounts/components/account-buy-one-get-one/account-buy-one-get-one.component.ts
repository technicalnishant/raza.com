import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-account-buy-one-get-one',
  templateUrl: './account-buy-one-get-one.component.html',
  styleUrls: ['./account-buy-one-get-one.component.scss']
})
export class AccountBuyOneGetOneComponent implements OnInit {

  constructor(private router: Router,) { }
  isLoading:boolean = false;
  ngOnInit(): void {
  }
   
  onClickRechargeButton()
  {
    this.isLoading = true;
    this.router.navigate(['deals/buy1-get1']);
  }
}
