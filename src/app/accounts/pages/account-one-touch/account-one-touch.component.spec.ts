import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountOneTouchComponent } from './account-one-touch.component';

describe('AccountOneTouchComponent', () => {
  let component: AccountOneTouchComponent;
  let fixture: ComponentFixture<AccountOneTouchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountOneTouchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOneTouchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
