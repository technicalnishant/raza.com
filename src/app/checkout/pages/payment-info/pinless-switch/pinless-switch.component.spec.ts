import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PinlessSwitchComponent } from './pinless-switch.component';

describe('PinlessSwitchComponent', () => {
  let component: PinlessSwitchComponent;
  let fixture: ComponentFixture<PinlessSwitchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinlessSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinlessSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
