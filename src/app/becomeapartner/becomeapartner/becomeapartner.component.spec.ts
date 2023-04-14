import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BecomeapartnerComponent } from './becomeapartner.component';

describe('BecomeapartnerComponent', () => {
  let component: BecomeapartnerComponent;
  let fixture: ComponentFixture<BecomeapartnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomeapartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomeapartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
