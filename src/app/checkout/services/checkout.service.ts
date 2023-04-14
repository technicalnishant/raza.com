import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICheckoutModel } from '../models/checkout-model';
import { TransactionResponseModel } from '../../payments/models/transaction-response.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }

  private static _cart: BehaviorSubject<ICheckoutModel> = new BehaviorSubject<ICheckoutModel>(null);
  private static _transResponse: BehaviorSubject<TransactionResponseModel> = new BehaviorSubject<TransactionResponseModel>(null);

  getCurrentCart(): Observable<ICheckoutModel> {
    return CheckoutService._cart.asObservable();
  }

  setCurrentCart(model: ICheckoutModel): void {
    CheckoutService._cart.next(model);
  }

  deleteCart() {
    CheckoutService._cart.next(null);
  }

  setTransResponse(response: TransactionResponseModel) {
    CheckoutService._transResponse.next(response);
  }

  getTransResponse(): Observable<TransactionResponseModel> {
    return CheckoutService._transResponse.asObservable();
  }


  clearTransResponse() {
    CheckoutService._transResponse.next(null);
  }

}
