import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCartComponent } from './set-cart.component';

describe('SetCartComponent', () => {
  let component: SetCartComponent;
  let fixture: ComponentFixture<SetCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
