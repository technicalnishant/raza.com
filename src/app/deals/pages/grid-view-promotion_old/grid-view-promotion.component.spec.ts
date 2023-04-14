import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GridViewPromotionComponent } from './grid-view-promotion.component';

describe('GridViewPromotionComponent', () => {
  let component: GridViewPromotionComponent;
  let fixture: ComponentFixture<GridViewPromotionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GridViewPromotionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridViewPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
