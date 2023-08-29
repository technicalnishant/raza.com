import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RazaLayoutService {
  public isFixHeader$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  setFixedHeader(fixed: boolean) {
    this.isFixHeader$.next(fixed);
  }


  private sharedValue: any;

  setSharedValue(value: any) {
    this.sharedValue = value;
  }

  getSharedValue(): any {
    return this.sharedValue;
  }
  
}
