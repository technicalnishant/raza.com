import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNotificationsComponent } from './mobile-notifications.component';

describe('MobileNotificationsComponent', () => {
  let component: MobileNotificationsComponent;
  let fixture: ComponentFixture<MobileNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
