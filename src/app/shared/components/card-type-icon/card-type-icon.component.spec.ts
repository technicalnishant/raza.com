import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardTypeIconComponent } from './card-type-icon.component';

describe('CardTypeIconComponent', () => {
  let component: CardTypeIconComponent;
  let fixture: ComponentFixture<CardTypeIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardTypeIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
