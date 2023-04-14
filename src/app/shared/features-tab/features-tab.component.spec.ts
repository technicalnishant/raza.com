import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FeaturesTabComponent } from './features-tab.component';

describe('FeaturesTabComponent', () => {
  let component: FeaturesTabComponent;
  let fixture: ComponentFixture<FeaturesTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
