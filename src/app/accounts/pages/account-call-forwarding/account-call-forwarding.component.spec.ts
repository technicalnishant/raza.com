import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountCallForwardingComponent } from './account-call-forwarding.component';

describe('AccountCallForwardingComponent', () => {
  let component: AccountCallForwardingComponent;
  let fixture: ComponentFixture<AccountCallForwardingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCallForwardingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCallForwardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
