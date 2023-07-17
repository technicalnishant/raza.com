import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewratesComponent } from './viewrates.component';

describe('ViewratesComponent', () => {
  let component: ViewratesComponent;
  let fixture: ComponentFixture<ViewratesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewratesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewratesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
