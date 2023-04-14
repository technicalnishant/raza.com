import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationRibbonComponent } from './notification-ribbon.component';

describe('NotificationRibbonComponent', () => {
  let component: NotificationRibbonComponent;
  let fixture: ComponentFixture<NotificationRibbonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
