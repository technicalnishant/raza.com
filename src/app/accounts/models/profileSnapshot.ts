import { BillingInfo } from "./billingInfo";
import { OrderHistory } from "./orderHistory";
import { CreditCard } from "./creditCard";

export class ProfileSnapshot {
    constructor(parameters) {
        
    }

    CreditCards: CreditCard[];
    BillingInfo: BillingInfo;
    OrderHistory: OrderHistory[];
    RewardPoints: number;
}

