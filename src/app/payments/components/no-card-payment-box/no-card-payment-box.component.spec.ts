import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCardPaymentBoxComponent } from './no-card-payment-box.component';

describe('NoCardPaymentBoxComponent', () => {
  let component: NoCardPaymentBoxComponent;
  let fixture: ComponentFixture<NoCardPaymentBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoCardPaymentBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCardPaymentBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
