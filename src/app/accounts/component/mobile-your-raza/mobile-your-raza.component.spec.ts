import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileYourRazaComponent } from './mobile-your-raza.component';

describe('MobileYourRazaComponent', () => {
  let component: MobileYourRazaComponent;
  let fixture: ComponentFixture<MobileYourRazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileYourRazaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileYourRazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
