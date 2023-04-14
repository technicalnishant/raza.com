import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RechargeConfirmationComponent } from './recharge-confirmation.component';

describe('RechargeConfirmationComponent', () => {
  let component: RechargeConfirmationComponent;
  let fixture: ComponentFixture<RechargeConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
