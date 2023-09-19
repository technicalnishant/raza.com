import { CreditCard } from "../../accounts/models/creditCard";

export class newPinRequestModel {
    orderId: string;
    amount: number;
    couponCode: string;
    paymentMethod: string;
    isPaymentProcessed: boolean;
    creditCardId: number;
    cvv2: string;
    paymentTransactionId: string;
    zipCodeResponse: string;
    addressResponse: string;
    cvv2Response: string;
    cavv: string;
    eciFlag: string;
    xid: string;
    ipAddress: string;
    payPalPayerId: string;
    isAutoReFill: boolean;
    autoReFillAmount: number;
    cardId: number;
    subCardId: string;
    countryFrom: number;
    countryTo: number;
    pinlessNumbers: string[];
    creditCard: CreditCard;
	nonce:string;
    ProcessedBy:string='';
    ActualAmountCharge: number;
    PaymentCurrency :string;
}