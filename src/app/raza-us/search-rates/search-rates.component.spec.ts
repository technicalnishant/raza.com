import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRatesComponent } from './search-rates.component';

describe('SearchRatesComponent', () => {
  let component: SearchRatesComponent;
  let fixture: ComponentFixture<SearchRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
