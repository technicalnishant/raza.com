export class CardinalResponse
{
    ActionCode : string
    ErrorDescription : string;
    ErrorNumber : string;
    Payment: Payment
    Validate: boolean
}

export class Payment
{
     ExtendedData : ExtendedData;
     ProcessorTransactionId : string;
     Type: string;

}


export class ExtendedData
{
     CAVV : string;
     ECIFlag : string;
     Enrolled : string
     PAResStatus : string;
     SignatureVerification : string;
     XID : string
}