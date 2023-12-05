import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TryUsFreeComponent } from './try-us-free.component';

describe('TryUsFreeComponent', () => {
  let component: TryUsFreeComponent;
  let fixture: ComponentFixture<TryUsFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TryUsFreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TryUsFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
