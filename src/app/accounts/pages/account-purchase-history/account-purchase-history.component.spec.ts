import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountPurchaseHistoryComponent } from './account-purchase-history.component';

describe('AccountPurchaseHistoryComponent', () => {
  let component: AccountPurchaseHistoryComponent;
  let fixture: ComponentFixture<AccountPurchaseHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPurchaseHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPurchaseHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
