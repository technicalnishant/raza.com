import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallasiaNewComponent } from './callasia-new.component';

describe('CallasiaNewComponent', () => {
  let component: CallasiaNewComponent;
  let fixture: ComponentFixture<CallasiaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallasiaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallasiaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
