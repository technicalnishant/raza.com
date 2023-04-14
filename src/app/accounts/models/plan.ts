import { CurrencyCode } from "../../core/interfaces/CurrencyCode";
//import { isNullOrUndefined } from "util";
import { PlanType } from "./PlanType";
import { isNullOrUndefined } from "../../shared/utilities";

export class Plan {
    constructor() {

    }

    PlanId: string;
    OrderId: string;
    CardName: string;
    Pin: string;
    LastRechargeDate: Date;
    CurrencyCode: CurrencyCode;
    Price: number;
    IsAllowRecharge: boolean;
    IsAllowCdr: boolean;
    IsAllowPinLess: boolean;
    IsAllowQuickKey: boolean;
    IsAllowCallForwarding: boolean;
    ArStatus: boolean;
    UsedFrom: number;
    ServiceChargePercent: number;
    PinStatus: string;
    CardId: number;
    CountryFrom: number;
    CountryTo: number;
    Balance: number;
    PlanType: PlanType;
    CustomerId: number;
    AccessNumbers: string[];

    get FirstAccessNumbers() {
        if (!isNullOrUndefined(this.AccessNumbers)) {
            return this.AccessNumbers[0];
        }
    }

    get IsDisplayAccessNumberShowMore() {
        if (!isNullOrUndefined(this.AccessNumbers)) {
            return this.AccessNumbers.length > 1
        }
        return false;
    }
}

