import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Buy5get5Component } from './buy5get5.component';

describe('Buy5get5Component', () => {
  let component: Buy5get5Component;
  let fixture: ComponentFixture<Buy5get5Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Buy5get5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Buy5get5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
