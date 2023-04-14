import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FreetrialDialogComponent } from './freetrial-dialog.component';

describe('FreetrialDialogComponent', () => {
  let component: FreetrialDialogComponent;
  let fixture: ComponentFixture<FreetrialDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FreetrialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetrialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
