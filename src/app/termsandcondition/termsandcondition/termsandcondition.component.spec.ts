import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsandconditionComponent } from './termsandcondition.component';

describe('TermsandconditionComponent', () => {
  let component: TermsandconditionComponent;
  let fixture: ComponentFixture<TermsandconditionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsandconditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsandconditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
