import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RedeemPromoComponent } from './redeem-promo.component';

describe('RedeemPromoComponent', () => {
  let component: RedeemPromoComponent;
  let fixture: ComponentFixture<RedeemPromoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemPromoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
