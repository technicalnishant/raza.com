import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalBuyComponent } from './global-buy.component';

describe('GlobalBuyComponent', () => {
  let component: GlobalBuyComponent;
  let fixture: ComponentFixture<GlobalBuyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
