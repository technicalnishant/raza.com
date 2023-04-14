import { Order } from "./cardinal-cruise.model";
import { PlanOrderInfo, ICheckoutOrderInfo } from "./planOrderInfo.model";

export class TransactionRequest {
    Jwt: string
    TransactionType: TransactionType;
    Order: Order;
    checkoutOrderInfo: ICheckoutOrderInfo
}

export enum TransactionType {
    Recharge    = 1, // Recharge
    Activation  = 2, // Activation
    Sale        = 3,  // New Plan.
    Topup       = 4,
    MR          = 5 // Recharge
}