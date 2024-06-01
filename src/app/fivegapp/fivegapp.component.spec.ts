import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FivegappComponent } from './fivegapp.component';

describe('FivegappComponent', () => {
  let component: FivegappComponent;
  let fixture: ComponentFixture<FivegappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FivegappComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FivegappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
