import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSigninComponent } from './auto-signin.component';

describe('AutoSigninComponent', () => {
  let component: AutoSigninComponent;
  let fixture: ComponentFixture<AutoSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
