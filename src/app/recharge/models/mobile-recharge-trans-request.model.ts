export class MobileRechargeRequestModel{
    constructor(){}

    OrderId: string
    CustomerId: number;
    Amount: number;
    CouponCode: string
    PaymentMethod: string
    IsPaymentProcessed: boolean;
    CreditCardId: number;
    Cvv2: string;
    PaymentTransactionId: string
    ZipCodeResponse: string
    AddressResponse: string;
    Cvv2Response: string;
    Cavv: string;
    EciFlag: string;
    Xid: string;
    IpAddress: string;
    PayPalPayerId: string;
    IsAutoReFill: boolean;
    AutoReFillAmount: number;
	nonce:string;
	DeviceId:string;
DeviceName:string;
DeviceModel:string;
DeviceType:string;
AppVersion:string;
ProcessedBy:string='';
}