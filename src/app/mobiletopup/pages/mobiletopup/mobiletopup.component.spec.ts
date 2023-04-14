import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MobiletopupComponent } from './mobiletopup.component';

describe('MobiletopupComponent', () => {
  let component: MobiletopupComponent;
  let fixture: ComponentFixture<MobiletopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
