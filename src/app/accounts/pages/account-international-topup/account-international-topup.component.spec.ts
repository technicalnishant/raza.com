import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountInternationalTopupComponent } from './account-international-topup.component';

describe('AccountInternationalTopupComponent', () => {
  let component: AccountInternationalTopupComponent;
  let fixture: ComponentFixture<AccountInternationalTopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountInternationalTopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInternationalTopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
