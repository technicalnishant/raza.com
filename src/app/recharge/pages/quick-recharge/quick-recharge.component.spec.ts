import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuickRechargeComponent } from './quick-recharge.component';

describe('RechargeComponent', () => {
  let component: QuickRechargeComponent;
  let fixture: ComponentFixture<QuickRechargeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QuickRechargeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
