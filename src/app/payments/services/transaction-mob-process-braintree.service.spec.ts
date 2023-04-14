import { TestBed } from '@angular/core/testing';

import { TransactionMobProcessBraintreeService } from './transaction-mob-process-braintree.service';

describe('TransactionMobProcessBraintreeService', () => {
  let service: TransactionMobProcessBraintreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransactionMobProcessBraintreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
