import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleDialogComponent } from './bundle-dialog.component';

describe('BundleDialogComponent', () => {
  let component: BundleDialogComponent;
  let fixture: ComponentFixture<BundleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BundleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BundleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
