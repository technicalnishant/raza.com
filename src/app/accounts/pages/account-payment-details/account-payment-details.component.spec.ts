import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountPaymentDetailsComponent } from './account-payment-details.component';

describe('AccountPaymentDetailsComponent', () => {
  let component: AccountPaymentDetailsComponent;
  let fixture: ComponentFixture<AccountPaymentDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
