import { OperatorDenominations } from "./operatorDenominations";

export class mobileTopupModel {
    constructor(parameters) {
    }

    CountryId: number;
    Operator: string;
    OperatorCode: string;
    OperatorDenominations: OperatorDenominations[];
    AvaliableOperators:any[];
}


