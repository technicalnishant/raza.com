import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallafricaNewComponent } from './callafrica-new.component';

describe('CallafricaNewComponent', () => {
  let component: CallafricaNewComponent;
  let fixture: ComponentFixture<CallafricaNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallafricaNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallafricaNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
