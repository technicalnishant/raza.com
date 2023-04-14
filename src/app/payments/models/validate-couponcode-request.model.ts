import { TransactionType } from "./transaction-request.model";

export class ValidateCouponCodeRequestModel {
    CouponCode: string;
    CardId: number;
    CountryFrom: number;
    CountryTo: number;
    Price: number;
    TransType: TransactionType;
}

export class ValidateCouponCodeResponseModel {
    Status: boolean;
    ErrorMessage: string
}