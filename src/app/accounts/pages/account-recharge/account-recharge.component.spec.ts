import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountRechargeComponent } from './account-recharge.component';

describe('AccountRechargeComponent', () => {
  let component: AccountRechargeComponent;
  let fixture: ComponentFixture<AccountRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
