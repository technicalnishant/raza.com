import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuyanaComponent } from './guyana.component';

describe('GuyanaComponent', () => {
  let component: GuyanaComponent;
  let fixture: ComponentFixture<GuyanaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuyanaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuyanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
