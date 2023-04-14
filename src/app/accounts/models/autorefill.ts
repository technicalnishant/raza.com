import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class AutoRefill {
    ActivationDate: Date;
    AutoRefillAmount: number;
    CardNumber: string;
    Status: AutoRefillStatus;
    CurrencyCode: CurrencyCode;
    PlanName: AutoRefillStatus;
}

export enum AutoRefillStatus {
    Active = 'A',
    Blocked = 'B',
    Inactive = 'I',
    Pending = 'P',
    Unsubscribed = 'U',
    PendingUnSubscribe = 'PU'
}