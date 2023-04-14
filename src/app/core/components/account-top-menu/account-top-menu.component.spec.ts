import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccountTopMenuComponent } from './account-top-menu.component';

describe('AccountTopMenuComponent', () => {
  let component: AccountTopMenuComponent;
  let fixture: ComponentFixture<AccountTopMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountTopMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTopMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
