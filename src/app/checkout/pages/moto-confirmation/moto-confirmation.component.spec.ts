import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoConfirmationComponent } from './moto-confirmation.component';

describe('MotoConfirmationComponent', () => {
  let component: MotoConfirmationComponent;
  let fixture: ComponentFixture<MotoConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotoConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotoConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
