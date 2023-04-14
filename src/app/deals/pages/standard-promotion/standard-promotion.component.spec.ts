import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { StandardPromotionComponent } from './standard-promotion.component';

describe('DealViewComponent', () => {
  let component: StandardPromotionComponent;
  let fixture: ComponentFixture<StandardPromotionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StandardPromotionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
