import { CurrencyCode } from "../../core/interfaces/CurrencyCode";
import { CreditCard } from "../../accounts/models/creditCard";


export class MobileTopupRequestModel {
    OrderId: string;
    CouponCode: string;
    PaymentMethod: string;
    IsPaymentProcessed: boolean;
    CreditCardId: number;
    Cvv2: string;
    PaymentTransactionId: string;
    ZipCodeResponse: string;
    AddressResponse: string;
    Cvv2Response: string;
    Cavv: string;
    EciFlag: string;
    Xid: string;
    IpAddress: string;
    PayPalPayerId: string;
    OperatorCode: string;
    Operator: string;
    CountryId: number;
    PurchaseAmount: number;
    SourceAmount: number;
    DestinationAmt: number;
    DestinationPhoneNumber: string;
    SmsTo: string;
    StoreNumber: number;
    DestinationCountryCode: string;
    creditCard: CreditCard
    CurrencyCode: CurrencyCode
	nonce:string;
}