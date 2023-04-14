import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaqGenericComponent } from './faq-generic.component';

describe('FaqGenericComponent', () => {
  let component: FaqGenericComponent;
  let fixture: ComponentFixture<FaqGenericComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqGenericComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
