import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusMinutesComponent } from './bonus-minutes.component';

describe('BonusMinutesComponent', () => {
  let component: BonusMinutesComponent;
  let fixture: ComponentFixture<BonusMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonusMinutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
