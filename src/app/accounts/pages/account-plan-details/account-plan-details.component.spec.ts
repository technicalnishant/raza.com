import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountPlanDetailsComponent } from './account-plan-details.component';

describe('AccountPlanDetailsComponent', () => {
  let component: AccountPlanDetailsComponent;
  let fixture: ComponentFixture<AccountPlanDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPlanDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
