import { TransactionType } from "./transaction-request.model";
import { CurrencyCode } from "../../core/interfaces/CurrencyCode";

export class GenerateTransactionRequestModel {
    constructor() {

    }

    transactionType: TransactionType;
    planId: string;
    purchaseAmount: number;
    cardName: string;
    currencyCode: CurrencyCode;
}