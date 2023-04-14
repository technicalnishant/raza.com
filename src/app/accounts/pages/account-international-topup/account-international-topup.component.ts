import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { CustomerService } from '../../services/customerService';
import { OrderHistory } from '../../models/orderHistory';
@Component({
  selector: 'app-account-international-topup',
  templateUrl: './account-international-topup.component.html',
  styleUrls: ['./account-international-topup.component.scss']
})
export class AccountInternationalTopupComponent implements OnInit {
  
  orderHistoryPage: number = 1;
  orderHistoryList: OrderHistory[] = [];
  
  constructor(private titleService: Title,
    private router: Router,
	private customerService: CustomerService,
    private razalayoutService: RazaLayoutService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('InterNational TopUp');
    this.razalayoutService.setFixedHeader(true);
	this.loadOrderHistory();
  }

  confirmPopup() {
    // do something
  }

  internationalTopUp() {
    this.router.navigate(['mobiletopup']);
  }
  
  recharge(instanceId) {
    //console.log('aa', instanceId); 
   this.router.navigateByUrl("recharge/"+ instanceId);
 }

 rechargeRedirect(obj)
 {
  //console.log(obj);
  //return false;
  //this.router.navigateByUrl("mobiletopup");

   var card = obj.CardName;
   card = card.split(' ');
   var iso = card[0];   
   this.router.navigateByUrl('mobiletopup', { state: { pin: obj.Pin, iso:iso } });
   //this.router.navigateByUrl("mobiletopup"); 
    
 }
 
  onClickShowMore() {
    this.orderHistoryPage = this.orderHistoryPage + 1;
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.customerService.getFullOrderHistory('topup', this.orderHistoryPage).subscribe(
      (data: OrderHistory[]) => {
      //  console.log('data',data);
        //this.orderHistoryList = data;
        data.map(a => {
          this.orderHistoryList.push(a);
        });
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }
  
}
