import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSearchRatesComponent } from './account-search-rates.component';

describe('AccountSearchRatesComponent', () => {
  let component: AccountSearchRatesComponent;
  let fixture: ComponentFixture<AccountSearchRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSearchRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSearchRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
