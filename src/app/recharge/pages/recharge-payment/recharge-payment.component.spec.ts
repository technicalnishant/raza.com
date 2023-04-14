import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RechargePaymentComponent } from './recharge-payment.component';

describe('RechargePaymentComponent', () => {
  let component: RechargePaymentComponent;
  let fixture: ComponentFixture<RechargePaymentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
