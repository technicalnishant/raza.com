import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebPayComponent } from './web-pay.component';

describe('WebPayComponent', () => {
  let component: WebPayComponent;
  let fixture: ComponentFixture<WebPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
