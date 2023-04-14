import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CallafricaComponent } from './callafrica.component';

describe('CallafricaComponent', () => {
  let component: CallafricaComponent;
  let fixture: ComponentFixture<CallafricaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CallafricaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallafricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
