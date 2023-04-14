import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaypalPaymentBoxComponent } from './paypal-payment-box.component';

describe('PaypalPaymentBoxComponent', () => {
  let component: PaypalPaymentBoxComponent;
  let fixture: ComponentFixture<PaypalPaymentBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalPaymentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalPaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
