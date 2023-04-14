import { Injectable, Output, EventEmitter, Input, Directive } from '@angular/core'
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class SideBarService {
  isOpen = false;
  @Input() sidenav: MatSidenav;
  
  
  @Output() change: EventEmitter<boolean> = new EventEmitter();

  toggle() {
    if (this.sidenav.opened)
      this.sidenav.toggle();
  }

  toggleRight() {
    
  }

}