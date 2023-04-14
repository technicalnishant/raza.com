import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyFiveGetFiveComponent } from './buy-five-get-five.component';

describe('BuyFiveGetFiveComponent', () => {
  let component: BuyFiveGetFiveComponent;
  let fixture: ComponentFixture<BuyFiveGetFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyFiveGetFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyFiveGetFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
