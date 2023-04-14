import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupNowComponent } from './topup-now.component';

describe('TopupNowComponent', () => {
  let component: TopupNowComponent;
  let fixture: ComponentFixture<TopupNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupNowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
