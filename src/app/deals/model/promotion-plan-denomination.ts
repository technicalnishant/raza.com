import { CurrencyCode } from "../../core/interfaces/CurrencyCode";


export class PromotionPlanDenomination {
    SubCardId: string;
    CountryToName:string;
    CurrencyCode: CurrencyCode;
    CountryToId: number;
    Price: number;
    ServiceCharg: number;
    RegularMin: number;
    FreeMin: number
    RatePerMin: number;
    IsPopular: boolean;
    IsPercentageAmountOffer: boolean;
    OfferPercentage: number;
}  