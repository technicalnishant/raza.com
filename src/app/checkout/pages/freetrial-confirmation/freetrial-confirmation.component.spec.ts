import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreetrialConfirmationComponent } from './freetrial-confirmation.component';

describe('FreetrialConfirmationComponent', () => {
  let component: FreetrialConfirmationComponent;
  let fixture: ComponentFixture<FreetrialConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreetrialConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreetrialConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
