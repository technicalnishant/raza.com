import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCallRatesComponent } from './global-call-rates.component';

describe('GlobalCallRatesComponent', () => {
  let component: GlobalCallRatesComponent;
  let fixture: ComponentFixture<GlobalCallRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalCallRatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCallRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
