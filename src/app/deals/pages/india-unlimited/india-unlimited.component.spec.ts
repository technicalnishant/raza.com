import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IndiaUnlimitedComponent } from './india-unlimited.component';

describe('IndiaUnlimitedComponent', () => {
  let component: IndiaUnlimitedComponent;
  let fixture: ComponentFixture<IndiaUnlimitedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ IndiaUnlimitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndiaUnlimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
