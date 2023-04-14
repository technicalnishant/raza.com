import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogintopdropmenuComponent } from './logintopdropmenu.component';

describe('LogintopdropmenuComponent', () => {
  let component: LogintopdropmenuComponent;
  let fixture: ComponentFixture<LogintopdropmenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogintopdropmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogintopdropmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
