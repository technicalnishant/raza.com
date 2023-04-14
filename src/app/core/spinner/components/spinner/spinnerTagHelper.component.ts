import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'raza-spinner-taghelper',
  templateUrl: './spinnerTagHelper.component.html',
  styleUrls: ['./spinnerTagHelper.component.scss']
})
export class SpinnerRazaTagHelperComponent implements OnInit, AfterViewChecked, OnDestroy {

  loaderStatus = false;
  loaderStatusHard = false;

  loaderPaymentStatus = false;
  loaderPaymentStatusHard = false;

  loader$: Subscription;
  loaderHard$: Subscription;
  loaderStatus$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loaderStatusHard$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  loaderp$: Subscription;
  loaderHardp$: Subscription;
  loaderPaymentStatus$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loaderPaymentStatusHard$: BehaviorSubject<boolean> = new BehaviorSubject(false);


  constructor(
    private _loaderService: LoaderService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loader$ = this._loaderService.loaderStatus.
      subscribe(res => {
        this.loaderStatus$.next(res);
        this.loaderStatus = res;
        this.cdRef.detectChanges();
      });

    this.loaderHard$ = this._loaderService.loaderStatusHard
      .subscribe(a => {
       this.loaderStatusHard$.next(a);
      this.loaderStatusHard = a;
        this.cdRef.detectChanges();
      });


      this.loaderp$ = this._loaderService.loaderPaymentStatus.
      subscribe(res => {
        this.loaderPaymentStatus$.next(res);
        this.loaderPaymentStatus = res;
        this.cdRef.detectChanges();
      });

    this.loaderHardp$ = this._loaderService.loaderPaymentStatusHard
      .subscribe(a => {
       this.loaderPaymentStatusHard$.next(a);
      this.loaderPaymentStatusHard = a;
        this.cdRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.loader$.unsubscribe();
    this.loaderHard$.unsubscribe();
    this.loaderp$.unsubscribe();
    this.loaderHardp$.unsubscribe();
  }


  ngAfterViewChecked() {

  }

}
