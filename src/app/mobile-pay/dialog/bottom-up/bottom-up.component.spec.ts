import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomUpComponent } from './bottom-up.component';

describe('BottomUpComponent', () => {
  let component: BottomUpComponent;
  let fixture: ComponentFixture<BottomUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
