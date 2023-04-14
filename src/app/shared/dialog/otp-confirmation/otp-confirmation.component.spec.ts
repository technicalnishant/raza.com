import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtpConfirmationComponent } from './otp-confirmation.component';

describe('OtpConfirmationComponent', () => {
  let component: OtpConfirmationComponent;
  let fixture: ComponentFixture<OtpConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtpConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
