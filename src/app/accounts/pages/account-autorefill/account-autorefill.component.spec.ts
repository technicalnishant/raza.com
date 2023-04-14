import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountAutorefillComponent } from './account-autorefill.component';

describe('AccountAutorefillComponent', () => {
  let component: AccountAutorefillComponent;
  let fixture: ComponentFixture<AccountAutorefillComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAutorefillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAutorefillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
