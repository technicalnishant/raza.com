import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';
import { AuthenticationService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customerService';
import { PlanService } from '../../services/planService';
import { Title } from '@angular/platform-browser';
import { OrderHistory } from '../../models/orderHistory';
import { CallHistory } from '../../models/callHistory';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { Plan } from '../../models/plan';
import { CallDetail } from '../../models/callDetail';

@Component({
  selector: 'app-mobile-your-raza',
  templateUrl: './mobile-your-raza.component.html',
  styleUrls: ['./mobile-your-raza.component.scss']
})
export class MobileYourRazaComponent implements OnInit, OnDestroy {

  id: any = 1;
  dealselected: any = 1;
  username: string;
  planId: string;
  orderHistoryPage: number = 1;
  isLinear = false;
  callDetailsSelectionControl: FormControl;
  displayedColumns: string[] = ['CardName', 'OrderDate', 'Amount', 'Add-Funds', 'Pin Number'];
  dataSource: MatTableDataSource<OrderHistory>;
  callDetailsSelectionSub$: Subscription;
   
  @Input() plan: Plan;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private planService: PlanService,
    private titleService: Title,
    private razalayoutService: RazaLayoutService,
  ) {
    this.planId = this.route.snapshot.paramMap.get('planId');

  }

  accessNumberList: string[];
  orderHistoryList: OrderHistory[] = [];
  callHistories: CallHistory[] = [];
  ngOnInit() {
    this.titleService.setTitle('Plan Details');
    this.razalayoutService.setFixedHeader(true);
    this.callDetailsSelectionControl = new FormControl('7');


     
          this.planId = this.plan.PlanId;
          this.loadAccessNumbers();
 
          this.loadPlanAndCallDetail(this.planId);
        

    

    this.callDetailsSelectionSub$ = this.callDetailsSelectionControl.valueChanges.subscribe(a => {
      this.loadCallDetails(a)
    });


  }

  ngOnDestroy(): void {
    this.callDetailsSelectionSub$.unsubscribe();
  }

  loadCallDetails(fromLatDays: number) {
    this.planService.getCallDetail(this.planId, fromLatDays).subscribe(
      (data: CallDetail[]) => { this.callHistories = data; },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  loadAccessNumbers() {
    this.customerService.getAccessNumber(this.planId).subscribe(
      (data: string[]) => { this.accessNumberList = data; },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  recharge(pin: string) {
    this.router.navigateByUrl("recharge/" + this.planId);
  }

  onClickShowMore() {
    this.orderHistoryPage = this.orderHistoryPage + 1;
    this.loadOrderHistory();
  }

  loadOrderHistory() {
    this.customerService.getOrderHistory(this.orderHistoryPage).subscribe(
      (data: OrderHistory[]) => {
        //this.orderHistoryList = data;
        data.map(a => {
          this.orderHistoryList.push(a);
        });
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  loadPlanAndCallDetail(planId: string) {
    this.planService.getPlan(planId).toPromise().then((res: Plan) => {
      this.plan = res;
      if (res.IsAllowCdr) {
        this.loadCallDetails(7);
      }
    })
  }
}
