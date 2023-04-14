import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class DealStandlonePlan {
    CardId: number;
    CardName: string;
    CouponCode: string;
    Price: number;
    ServiceCharge: number;
    CurrencyCode: CurrencyCode;
    FreeMin: number;
    IsPopular: false;
    RatePerMin: number;
    RegularMin: number;
    SubCardId: string;
    IsMobilePlan?: boolean;
    IsLandLinePlan?: boolean;
    CountryId: number;
}