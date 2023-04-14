import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VirtualnumberComponent } from './virtualnumber.component';

describe('VirtualnumberComponent', () => {
  let component: VirtualnumberComponent;
  let fixture: ComponentFixture<VirtualnumberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualnumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
