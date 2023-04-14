import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountMyNumberComponent } from './account-my-number.component';

describe('AccountMyNumberComponent', () => {
  let component: AccountMyNumberComponent;
  let fixture: ComponentFixture<AccountMyNumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMyNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
