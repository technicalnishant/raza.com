import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OtherPlansContainerComponent } from './other-plans-container.component';

describe('OtherPlansContainerComponent', () => {
  let component: OtherPlansContainerComponent;
  let fixture: ComponentFixture<OtherPlansContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPlansContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPlansContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
