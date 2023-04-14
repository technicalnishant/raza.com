import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountOverviewPlanInfoComponent } from './account-overview-plan-info.component';

describe('AccountOverviewPlanInfoComponent', () => {
  let component: AccountOverviewPlanInfoComponent;
  let fixture: ComponentFixture<AccountOverviewPlanInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOverviewPlanInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOverviewPlanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
