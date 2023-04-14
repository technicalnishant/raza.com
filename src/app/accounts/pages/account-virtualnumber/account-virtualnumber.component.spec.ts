import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountVirtualnumberComponent } from './account-virtualnumber.component';

describe('AccountVirtualnumberComponent', () => {
  let component: AccountVirtualnumberComponent;
  let fixture: ComponentFixture<AccountVirtualnumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountVirtualnumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountVirtualnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
