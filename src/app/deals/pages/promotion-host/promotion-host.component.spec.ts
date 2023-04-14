import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromotionHostComponent } from './promotion-host.component';

describe('PromotionViewComponent', () => {
  let component: PromotionHostComponent;
  let fixture: ComponentFixture<PromotionHostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromotionHostComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
