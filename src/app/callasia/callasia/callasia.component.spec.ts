import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CallasiaComponent } from './callasia.component';

describe('CallasiaComponent', () => {
  let component: CallasiaComponent;
  let fixture: ComponentFixture<CallasiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CallasiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallasiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
