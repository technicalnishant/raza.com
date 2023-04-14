import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignuppopupComponent } from './signuppopup.component';

describe('SignuppopupComponent', () => {
  let component: SignuppopupComponent;
  let fixture: ComponentFixture<SignuppopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignuppopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignuppopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
