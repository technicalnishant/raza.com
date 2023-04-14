import { TestBed } from '@angular/core/testing';

import { BrainTreePaymentMobileService } from './brain-tree-payment-mobile.service';

describe('BrainTreePaymentMobileService', () => {
  let service: BrainTreePaymentMobileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrainTreePaymentMobileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
