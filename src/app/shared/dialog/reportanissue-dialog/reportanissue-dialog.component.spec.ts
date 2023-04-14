import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportanissueDialogComponent } from './reportanissue-dialog.component';

describe('NotificationDialogComponent', () => {
  let component: ReportanissueDialogComponent;
  let fixture: ComponentFixture<ReportanissueDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportanissueDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportanissueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
