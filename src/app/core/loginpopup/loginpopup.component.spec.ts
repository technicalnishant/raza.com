import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginpopupComponent } from './loginpopup.component';

describe('LoginpopupComponent', () => {
  let component: LoginpopupComponent;
  let fixture: ComponentFixture<LoginpopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
