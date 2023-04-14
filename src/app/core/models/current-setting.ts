import { Country } from "./country.model";
import { CurrencyCode } from "../interfaces/CurrencyCode";

export class CurrentSetting {
    country: Country
    get currency(): CurrencyCode {
        let currency: CurrencyCode = CurrencyCode.USD;
        if (this.country.CountryId === 2) {
            currency = CurrencyCode.CAD;
        } else if (this.country.CountryId === 3) {
            currency = CurrencyCode.GBP;
        }
        else if (this.country.CountryId === 8) {
            currency = CurrencyCode.AUD;
        }
        else if (this.country.CountryId === 20) {
            currency = CurrencyCode.NZD;
        }
        else if (this.country.CountryId === 26) {
            currency = CurrencyCode.INR;
        }

        return currency;
    }

    get currentCountryId(): number {
        return this.country.CountryId;
    }
}