import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountCallDetailsComponent } from './account-call-details.component';

describe('AccountCallDetailsComponent', () => {
  let component: AccountCallDetailsComponent;
  let fixture: ComponentFixture<AccountCallDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountCallDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
