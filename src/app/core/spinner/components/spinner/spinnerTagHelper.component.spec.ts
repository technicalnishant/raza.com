import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SpinnerRazaTagHelperComponent } from './spinnerTagHelper.component';



describe('SpinnerRazaTagHelperComponent', () => {
  let component: SpinnerRazaTagHelperComponent;
  let fixture: ComponentFixture<SpinnerRazaTagHelperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SpinnerRazaTagHelperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerRazaTagHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
