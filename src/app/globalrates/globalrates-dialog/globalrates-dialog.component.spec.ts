import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GlobalratesDialogComponent } from './globalrates-dialog.component';

describe('GlobalratesDialogComponent', () => {
  let component: GlobalratesDialogComponent;
  let fixture: ComponentFixture<GlobalratesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalratesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalratesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
