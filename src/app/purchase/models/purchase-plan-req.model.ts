import { Denominations } from "../../globalrates/model/denominations";
import { Country } from "../../shared/model/country";
import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class PurchasePlanReqModel {
    CardId: number;
    CardName: string;
    CurrencyCode: CurrencyCode;
    details: Denominations;
    country: Country;
    phoneNumber: string;
    countryFrom: number;
    countryTo: number;
}