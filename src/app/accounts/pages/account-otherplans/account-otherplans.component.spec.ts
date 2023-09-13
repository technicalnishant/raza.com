import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountOtherplansComponent } from './account-otherplans.component';

describe('AccountOtherplansComponent', () => {
  let component: AccountOtherplansComponent;
  let fixture: ComponentFixture<AccountOtherplansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountOtherplansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountOtherplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
