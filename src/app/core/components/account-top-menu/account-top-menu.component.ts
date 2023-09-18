import { Component, OnInit, Input, EventEmitter, Output, ViewChild, Renderer2 } from '@angular/core';
import { Plan } from '../../../accounts/models/plan';
import { Router, NavigationStart } from '@angular/router';
import { HeaderComponent } from 'app/core/header/header.component';
@Component({
  selector: 'app-account-top-menu',
  templateUrl: './account-top-menu.component.html',
  styleUrls: ['./account-top-menu.component.scss']
})
export class AccountTopMenuComponent implements OnInit {
  @Input() plan: Plan;
  @Input() myMethod: Function;
  @Output() childEvent = new EventEmitter<void>();
  @ViewChild(HeaderComponent) headerComponent: HeaderComponent;
  constructor(private router: Router,private renderer: Renderer2
  ) { }
  
  ngOnInit() {
     
    
  }

  closeParent(): void {
    // Call the function in ParentComponent
   // this.headerComponent.closeIconLogin();
    // Get all elements with the class "my-button"
  const elements = document.querySelectorAll('.closeIconContact');

  // Trigger a click event on each element
  elements.forEach((element) => {
    this.renderer.selectRootElement(element).click();
  });
  }
   
   
}
