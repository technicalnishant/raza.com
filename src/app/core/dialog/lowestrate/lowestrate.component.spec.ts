import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowestrateComponent } from './lowestrate.component';

describe('LowestrateComponent', () => {
  let component: LowestrateComponent;
  let fixture: ComponentFixture<LowestrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LowestrateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LowestrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
