import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaymentFailedDialogComponent } from './payment-failed-dialog.component';

describe('PaymentFailedDialogComponent', () => {
  let component: PaymentFailedDialogComponent;
  let fixture: ComponentFixture<PaymentFailedDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFailedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFailedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
