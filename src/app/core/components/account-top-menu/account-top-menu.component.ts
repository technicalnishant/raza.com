import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../../accounts/models/plan';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-account-top-menu',
  templateUrl: './account-top-menu.component.html',
  styleUrls: ['./account-top-menu.component.scss']
})
export class AccountTopMenuComponent implements OnInit {
  @Input() plan: Plan;
  @Input() myMethod: Function;
  constructor(private router: Router,
  ) { }
  
  ngOnInit() {
    this.router.events.subscribe(event => {
      
        this.myMethod();
       
    })
  }
}
