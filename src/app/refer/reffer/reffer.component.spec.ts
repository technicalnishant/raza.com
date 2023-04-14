import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferComponent } from './reffer.component';

describe('RefferComponent', () => {
  let component: RefferComponent;
  let fixture: ComponentFixture<RefferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
