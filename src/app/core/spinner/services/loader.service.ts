import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// A service for showing a loader throughout the app
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public loaderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loaderStatusHard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  public loaderPaymentStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public loaderPaymentStatusHard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  displayPaymentLoader(value: boolean) {
    this.loaderPaymentStatus.next(value);
    this.loaderStatus.next(false);
  }

  displayPaymentHard(value: boolean) {
    this.loaderPaymentStatusHard.next(value);
    //console.log("Payment hard clicked");
  }


  displayLoader(value: boolean) {
    this.loaderStatus.next(value);
  }

  displayHard(value: boolean) {
    this.loaderStatusHard.next(value);
  }
}
