import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCofirmComponent } from './dialog-cofirm.component';

describe('DialogCofirmComponent', () => {
  let component: DialogCofirmComponent;
  let fixture: ComponentFixture<DialogCofirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCofirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCofirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
