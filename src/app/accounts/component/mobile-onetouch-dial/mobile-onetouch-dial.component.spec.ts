import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOnetouchDialComponent } from './mobile-onetouch-dial.component';

describe('MobileOnetouchDialComponent', () => {
  let component: MobileOnetouchDialComponent;
  let fixture: ComponentFixture<MobileOnetouchDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileOnetouchDialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileOnetouchDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
