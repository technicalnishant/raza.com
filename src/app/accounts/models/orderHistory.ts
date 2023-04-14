import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class OrderHistory {
    constructor(parameters) {

    }

    OrderId: string;
    CardId: number;
    CardName: string;
    Pin: string;
    OrderDate: Date;
    CurrencyCode: CurrencyCode;
    Price: number;
    TransType: string;
    IsAllowRecharge: boolean;
    IsAllowPinLess: boolean;
    IsAllowQuickKeys: boolean;
    IsAllowCallDetail: boolean;
    IsAllowCallForwarding: boolean;
    ArStatus: boolean;
    PinStatus: boolean;
}