import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetrialNewComponent } from './freetrial-new.component';

describe('FreetrialNewComponent', () => {
  let component: FreetrialNewComponent;
  let fixture: ComponentFixture<FreetrialNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreetrialNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetrialNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
