import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommanFaqsComponent } from './comman-faqs.component';

describe('CommanFaqsComponent', () => {
  let component: CommanFaqsComponent;
  let fixture: ComponentFixture<CommanFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommanFaqsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommanFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
