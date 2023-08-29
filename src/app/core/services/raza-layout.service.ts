import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RazaLayoutService {
  public isFixHeader$ = new BehaviorSubject<boolean>(false);
  private sharedValueSubject = new Subject<any>();
  constructor() { }

  setFixedHeader(fixed: boolean) {
    this.isFixHeader$.next(fixed);
  }


  private sharedValue: any;

  setSharedValue(value: any) {
    this.sharedValueSubject.next(value);
  }

  getSharedValue() {
    return this.sharedValueSubject.asObservable();
  }

}
