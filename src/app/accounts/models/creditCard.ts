export class CreditCard {
    constructor() {

    }
    CardId: number;
    CardNumber: string;
    CardType: string;
    ExpiryDate: Date
    ExpiryMonth: number
    ExpiryYear: number
    Cvv: string
    Status: boolean
    CardHolderName: string

    IsPrimary: boolean
    //adding billing info
    FullName: string
    Country: string
    State: string
    BillingAddress: string
    City: string
    PostalCode: string
    PhoneNumber?: string
}