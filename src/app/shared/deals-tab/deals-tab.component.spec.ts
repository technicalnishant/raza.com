import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DealsTabComponent } from './deals-tab.component';

describe('DealsTabComponent', () => {
  let component: DealsTabComponent;
  let fixture: ComponentFixture<DealsTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
