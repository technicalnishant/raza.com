import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CallDetailsComponent } from './call-details.component';

describe('CallDetailsComponent', () => {
  let component: CallDetailsComponent;
  let fixture: ComponentFixture<CallDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CallDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
