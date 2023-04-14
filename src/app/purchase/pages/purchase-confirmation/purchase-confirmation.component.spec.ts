import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseConfirmationComponent } from './purchase-confirmation.component';

describe('PurchaseConfirmationComponent', () => {
  let component: PurchaseConfirmationComponent;
  let fixture: ComponentFixture<PurchaseConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
