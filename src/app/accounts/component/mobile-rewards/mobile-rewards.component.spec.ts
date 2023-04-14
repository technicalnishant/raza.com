import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRewardsComponent } from './mobile-rewards.component';

describe('MobileRewardsComponent', () => {
  let component: MobileRewardsComponent;
  let fixture: ComponentFixture<MobileRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileRewardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
