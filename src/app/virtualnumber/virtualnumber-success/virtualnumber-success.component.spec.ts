import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VirtualnumberSuccessComponent } from './virtualnumber-success.component';

describe('VirtualnumberSuccessComponent', () => {
  let component: VirtualnumberSuccessComponent;
  let fixture: ComponentFixture<VirtualnumberSuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VirtualnumberSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualnumberSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
