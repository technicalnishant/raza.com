import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCallDetailsComponent } from './mobile-call-details.component';

describe('MobileCallDetailsComponent', () => {
  let component: MobileCallDetailsComponent;
  let fixture: ComponentFixture<MobileCallDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileCallDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
