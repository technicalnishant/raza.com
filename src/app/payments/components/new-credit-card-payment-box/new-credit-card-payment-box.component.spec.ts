import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewCreditCardPaymentBoxComponent } from './new-credit-card-payment-box.component';

describe('NewCreditCardPaymentBoxComponent', () => {
  let component: NewCreditCardPaymentBoxComponent;
  let fixture: ComponentFixture<NewCreditCardPaymentBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCreditCardPaymentBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCreditCardPaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
