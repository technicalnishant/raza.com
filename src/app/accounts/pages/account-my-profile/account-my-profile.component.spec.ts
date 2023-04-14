import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountMyProfileComponent } from './account-my-profile.component';

describe('AccountMyProfileComponent', () => {
  let component: AccountMyProfileComponent;
  let fixture: ComponentFixture<AccountMyProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
