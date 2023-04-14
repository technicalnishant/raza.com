import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalCallratesComponent } from './global-callrates.component';

describe('GlobalCallratesComponent', () => {
  let component: GlobalCallratesComponent;
  let fixture: ComponentFixture<GlobalCallratesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalCallratesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalCallratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
