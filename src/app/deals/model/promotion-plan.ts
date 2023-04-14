import { PromotionPlanDenomination } from "./promotion-plan-denomination";

export class PromotionPlan {
    PromotionPlanId: number;
    CardId: number;
    CardName: string;
    CouponCode: string;
    ServiceCharge: number;
    IsMobile: boolean;
    IsLandLine: boolean;
    IsEditCoupon: boolean;
    CountryToName: string;
    Denominations: PromotionPlanDenomination[]
}