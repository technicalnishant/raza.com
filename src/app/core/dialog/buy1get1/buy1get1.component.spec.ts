import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Buy1get1Component } from './buy1get1.component';

describe('Buy1get1Component', () => {
  let component: Buy1get1Component;
  let fixture: ComponentFixture<Buy1get1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Buy1get1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Buy1get1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
