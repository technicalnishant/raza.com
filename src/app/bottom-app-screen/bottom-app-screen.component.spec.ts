import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomAppScreenComponent } from './bottom-app-screen.component';

describe('BottomAppScreenComponent', () => {
  let component: BottomAppScreenComponent;
  let fixture: ComponentFixture<BottomAppScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomAppScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomAppScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
