import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanCheckoutComponent } from './plan-checkout.component';

describe('PlanCheckoutComponent', () => {
  let component: PlanCheckoutComponent;
  let fixture: ComponentFixture<PlanCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
