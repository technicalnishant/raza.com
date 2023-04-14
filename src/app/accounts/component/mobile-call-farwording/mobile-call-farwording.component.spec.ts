import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCallFarwordingComponent } from './mobile-call-farwording.component';

describe('MobileCallFarwordingComponent', () => {
  let component: MobileCallFarwordingComponent;
  let fixture: ComponentFixture<MobileCallFarwordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileCallFarwordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileCallFarwordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
