import { CurrencyCode } from "../../core/interfaces/CurrencyCode";
import { ICheckoutModel } from "../../checkout/models/checkout-model";
import { CreditCard } from "../../accounts/models/creditCard";

export interface ICheckoutOrderInfo {
    creditCard: CreditCard;
    checkoutCart: ICheckoutModel;
    logoutAfterProcess?: boolean;
}

export class ActivationOrderInfo implements ICheckoutOrderInfo {
    creditCard: CreditCard;
    checkoutCart: ICheckoutModel;
}

export class RechargeOrderInfo implements ICheckoutOrderInfo {
    creditCard: CreditCard;
    checkoutCart: ICheckoutModel;
    logoutAfterProcess?: boolean;
}

export class MobileTopupOrderInfo implements ICheckoutOrderInfo {
    creditCard: CreditCard;
    checkoutCart: ICheckoutModel;

    logoutAfterProcess?: boolean;
}

export class PlanOrderInfo {
    constructor() {

    }

    pin: string;
    cardId: number;
    subCardId?: string;
    cardName?: string;
    currencyCode?: CurrencyCode;
    countryFrom?: number;
    countryTo?: number;
    aniNumber?: string;
    serviceFee?: number;
}

export class newPinOrderInfo {

}

export interface IPaypalCheckoutOrderInfo {
    checkoutCart: ICheckoutModel;
    orderId: string;
    paypalPayerId: string;
    paymentTransactionId: string;
}