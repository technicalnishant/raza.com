import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMyaccountComponent } from './mobile-myaccount.component';

describe('MobileMyaccountComponent', () => {
  let component: MobileMyaccountComponent;
  let fixture: ComponentFixture<MobileMyaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMyaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMyaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
