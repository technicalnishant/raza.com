import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customerService';
import { OrderHistory } from '../../models/orderHistory';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { Title } from '@angular/platform-browser';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { PlanService } from 'app/accounts/services/planService';
import { Plan } from 'app/accounts/models/plan';

@Component({
  selector: 'app-mobile-order-history',
  templateUrl: './mobile-order-history.component.html',
  styleUrls: ['./mobile-order-history.component.scss']
})
export class MobileOrderHistoryComponent implements OnInit {
  orderHistoryPage: number = 1;
  orderHistoryList: OrderHistory[] = [];
  planId:any
  @Input() plan: Plan;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private titleService: Title,
    private planService: PlanService,
    private razalayoutService: RazaLayoutService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Order History')
    this.razalayoutService.setFixedHeader(true);
    this.planId =  this.plan.PlanId;

    
           
          //load order history
          this.loadOrderHistory();
 

  }


  recharge(instanceId) {
     //console.log('aa', instanceId); 
    this.router.navigateByUrl("recharge/"+ instanceId);
  }

  rechargeRedirect(obj)
  {
   // console.log(obj);
  // this.router.navigate(['/b'], {state: {data: {...}}});
    //this.router.navigateByUrl("mobiletopup");
   
    var card = obj.CardName;
   card = card.split(' ');
   var iso = card[0];
   
   this.router.navigateByUrl('mobiletopup', { state: { pin: obj.Pin, iso:iso } });

  }
  onClickShowMore() {
    this.orderHistoryPage = this.orderHistoryPage + 1;
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.customerService.getOrderHistory(this.orderHistoryPage).subscribe(
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
