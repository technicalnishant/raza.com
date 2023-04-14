import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class FreeTrial {
    constructor(parameters) {
    }

    CountryFrom: number;
    CountryTo: number;
    CountryName: string;
    FreeMinutes: number;
    CardId: number;
    CardName: string;
    CurrencyCode: CurrencyCode
    CouponCode: string;
}