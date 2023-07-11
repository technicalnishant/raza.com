import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalcallComponent } from './globalcall_newLogin.component';

describe('GlobalcallComponent', () => {
  let component: GlobalcallComponent;
  let fixture: ComponentFixture<GlobalcallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalcallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
