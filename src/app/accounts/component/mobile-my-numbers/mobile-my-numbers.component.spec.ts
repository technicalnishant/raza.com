import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileMyNumbersComponent } from './mobile-my-numbers.component';

describe('MobileMyNumbersComponent', () => {
  let component: MobileMyNumbersComponent;
  let fixture: ComponentFixture<MobileMyNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileMyNumbersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileMyNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
