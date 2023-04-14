import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndiaOneCentComponent } from './india-one-cent.component';

describe('IndiaOneCentComponent', () => {
  let component: IndiaOneCentComponent;
  let fixture: ComponentFixture<IndiaOneCentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiaOneCentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiaOneCentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
