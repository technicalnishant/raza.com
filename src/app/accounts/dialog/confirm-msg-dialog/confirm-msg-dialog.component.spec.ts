import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmMsgDialogComponent } from './confirm-msg-dialog.component';

describe('ConfirmMsgDialogComponent', () => {
  let component: ConfirmMsgDialogComponent;
  let fixture: ComponentFixture<ConfirmMsgDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmMsgDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMsgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
