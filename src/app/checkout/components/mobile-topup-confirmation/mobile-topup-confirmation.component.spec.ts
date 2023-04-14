import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MobileTopupConfirmationComponent } from './mobile-topup-confirmation.component';

describe('MobileTopupConfirmationComponent', () => {
  let component: MobileTopupConfirmationComponent;
  let fixture: ComponentFixture<MobileTopupConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTopupConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTopupConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
