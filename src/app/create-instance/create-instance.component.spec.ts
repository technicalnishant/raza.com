import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateInstanceComponent } from './create-instance.component';

describe('CreateInstanceComponent', () => {
  let component: CreateInstanceComponent;
  let fixture: ComponentFixture<CreateInstanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
