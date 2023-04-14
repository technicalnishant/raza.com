import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOrderHistoryComponent } from './mobile-order-history.component';

describe('MobileOrderHistoryComponent', () => {
  let component: MobileOrderHistoryComponent;
  let fixture: ComponentFixture<MobileOrderHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileOrderHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileOrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
