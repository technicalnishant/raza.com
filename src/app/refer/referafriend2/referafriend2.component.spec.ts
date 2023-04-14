import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Referafriend2Component } from './referafriend2.component';

describe('Referafriend2Component', () => {
  let component: Referafriend2Component;
  let fixture: ComponentFixture<Referafriend2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Referafriend2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Referafriend2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
