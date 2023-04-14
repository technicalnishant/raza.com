import { Denominations } from "../../globalrates/model/denominations";
import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class Deal {
    PromotionCode: string;
    PromotionName: string;
    Icon: string;
    CouponCode: string;
    Banner: string;
    CardId: number;
    CardName: string;
    Denominations: PromotionDenomination[]
}

export class PromotionDenomination {
    Price: number;
    ServiceCharge: number;
    CurrencyCode: CurrencyCode;
    FreeMin: number;
    IsPopular: false
    PurchaseAmount: number;
    RatePerMin: number;
    RegularMin: number;
    SubCardId: string;
    IsMobilePlan?: boolean;
    IsLandLinePlan?: boolean;
}