export class Deals {
    dealId: number;
    couponCode: string;
    dealName: string;
    countries: DealCountry[];
}

export class DealCountry{
    countryId: number;
    countryNumber: string;
    dealRates: DealRates[]
}

export class DealRates {
    price: number;
    freeMin: number;
    regularMin: number;
    ratePerMin: number;
}
