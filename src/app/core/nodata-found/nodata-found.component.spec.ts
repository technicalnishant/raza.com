import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NodataFoundComponent } from './nodata-found.component';

describe('NodataFoundComponent', () => {
  let component: NodataFoundComponent;
  let fixture: ComponentFixture<NodataFoundComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NodataFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodataFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
