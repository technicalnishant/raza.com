import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HowitworksComponent } from './howitworks.component';

describe('HowitworksComponent', () => {
  let component: HowitworksComponent;
  let fixture: ComponentFixture<HowitworksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HowitworksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowitworksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
