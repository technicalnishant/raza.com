import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customerService';
import { PlanService } from '../../services/planService';
import { Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { ApiErrorResponse } from '../../../core/models/ApiErrorResponse';
import { CallHistory } from '../../models/callHistory';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';
import { CallDetail } from '../../models/callDetail';
import { Plan } from 'app/accounts/models/plan';

@Component({
  selector: 'app-mobile-call-details',
  templateUrl: './mobile-call-details.component.html',
  styleUrls: ['./mobile-call-details.component.scss']
})
export class MobileCallDetailsComponent implements OnInit, OnDestroy {
  dateToday = new Date();
  dateFrom: any;
  dateTo: any;
  planId: string;
  callHistories: CallHistory[];
  callDetailsSelectionControl: FormControl;
  callDetailsSelectionSub$: Subscription;
  @Input() plan: Plan;
  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private datePipe: DatePipe,
    private razalayoutService: RazaLayoutService,
  ) {
    


  }

  ngOnInit() {
 
    this.razalayoutService.setFixedHeader(true);
    this.callDetailsSelectionControl = new FormControl('7');

    
          this.planId = this.plan.PlanId;
         this.loadCallDetail(7);
        

   

    this.callDetailsSelectionSub$ = this.callDetailsSelectionControl.valueChanges.subscribe(a => {
      this.loadCallDetail(a)
    });

  }


  ngOnDestroy(): void {
    this.callDetailsSelectionSub$.unsubscribe();
  }

  loadCallDetail(fromLastDays: number) {
    this.planService.getCallDetail(this.planId, fromLastDays).subscribe(
      (data: CallDetail[]) => { this.callHistories = data; },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

}
