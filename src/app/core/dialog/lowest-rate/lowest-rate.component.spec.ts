import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowestRateComponent } from './lowest-rate.component';

describe('LowestRateComponent', () => {
  let component: LowestRateComponent;
  let fixture: ComponentFixture<LowestRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowestRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LowestRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
