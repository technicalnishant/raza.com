import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBuyOneGetOneComponent } from './account-buy-one-get-one.component';

describe('AccountBuyOneGetOneComponent', () => {
  let component: AccountBuyOneGetOneComponent;
  let fixture: ComponentFixture<AccountBuyOneGetOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountBuyOneGetOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountBuyOneGetOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
