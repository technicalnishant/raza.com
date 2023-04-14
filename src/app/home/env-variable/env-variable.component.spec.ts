import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EnvVariableComponent } from './env-variable.component';

describe('EnvVariableComponent', () => {
  let component: EnvVariableComponent;
  let fixture: ComponentFixture<EnvVariableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EnvVariableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvVariableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
