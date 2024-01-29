import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Buy1get1Component } from 'app/core/dialog/buy1get1/buy1get1.component';
@Component({
  selector: 'app-account-buy-one-get-one',
  templateUrl: './account-buy-one-get-one.component.html',
  styleUrls: ['./account-buy-one-get-one.component.scss']
})
export class AccountBuyOneGetOneComponent implements OnInit {

  constructor(private router: Router, public dialog: MatDialog,) { }
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
    //this.router.navigate(['deals/buy1-get1']);
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.panelClass = "tryUsFree";
    dialogConfig.width = "100%";
    dialogConfig.height = "90%";
    dialogConfig.data = {
      name: "buy1get1",
      title: "Buy1 Get1", 
    }
    const modalDialog = this.dialog.open(Buy1get1Component, dialogConfig);
  }
}
