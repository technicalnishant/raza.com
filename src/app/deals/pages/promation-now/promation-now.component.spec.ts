import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromationNowComponent } from './promation-now.component';

describe('PromationNowComponent', () => {
  let component: PromationNowComponent;
  let fixture: ComponentFixture<PromationNowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromationNowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromationNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
