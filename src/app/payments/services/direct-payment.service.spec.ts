import { TestBed } from '@angular/core/testing';

import { DirectPaymentService } from './direct-payment.service';

describe('DirectPaymentService', () => {
  let service: DirectPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
