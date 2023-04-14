import { RefillPlans } from "./refillPlans";
import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class GlobalPlansData {
    constructor(parameters) {
    }
    CardId: number;
    CardName: string;
    CurrencyCode: CurrencyCode;
    SubCardId: string;
    Price: number;
    CallingRate: number;
    ServiceCharge: number;
    AutoReFillExtra: string;
    Priority: number;
    TotalTime: number;
    CategoryId: number;
    WithoutAutorefillPlans: RefillPlans;
    AutorefillPlans: RefillPlans;
}