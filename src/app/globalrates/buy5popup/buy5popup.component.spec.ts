import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Buy5popupComponent } from './buy5popup.component';

describe('Buy5popupComponent', () => {
  let component: Buy5popupComponent;
  let fixture: ComponentFixture<Buy5popupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Buy5popupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Buy5popupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
