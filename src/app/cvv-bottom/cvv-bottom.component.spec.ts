import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvvBottomComponent } from './cvv-bottom.component';

describe('CvvBottomComponent', () => {
  let component: CvvBottomComponent;
  let fixture: ComponentFixture<CvvBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvvBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvvBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
