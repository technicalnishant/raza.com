import { TransactionType } from "./transaction-request.model";
import { PaymentMethod } from "./payment-method";

export class IsCentinelBypassRequestModel{
    constructor(){

    }

   CardNumber : string;
   TransactionType: TransactionType
   PurchaseAmount: number;
   DestinationCountry: number;
   PaymentMethod: PaymentMethod
}