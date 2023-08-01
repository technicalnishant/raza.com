import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatIsCvvComponent } from './what-is-cvv.component';

describe('WhatIsCvvComponent', () => {
  let component: WhatIsCvvComponent;
  let fixture: ComponentFixture<WhatIsCvvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatIsCvvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatIsCvvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
