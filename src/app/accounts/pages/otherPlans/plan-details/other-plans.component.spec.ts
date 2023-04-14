import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OtherPlansComponent } from './other-plans.component';



describe('OtherPlansComponent', () => {
  let component: OtherPlansComponent;
  let fixture: ComponentFixture<OtherPlansComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OtherPlansComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
