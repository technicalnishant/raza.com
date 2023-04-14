export class BillingInfo
{
    constructor(){}
    FirstName: string;
    LastName: string;
    Email: string;
    Address:Address
    ReferrerEmailId: string
}

export class Address 
{
    StreetAddress: string;
    City: string;
    State: string;
    Country: BillingCountry;
    ZipCode: string;
    Email: string;
    HomePhone: string;
    WorkPhone: string;
    Mobile: string;
}

export class BillingCountry
{
    CountryId: number;
    CountryName: string;
    CountryCode: string;
}

export class State{
    Id: string;
    Name: string;
}

export class PostalCode{
    codes: string;
}

export class ProcessedCard{
      
    CardId: number;
    CardNumber: string;  
    
    ExpiryMonth: number
    ExpiryYear: number
    Cvv: string
    
}