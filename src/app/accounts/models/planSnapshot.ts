import { Plan } from "./plan";
import { OneTouchNumber } from "./onetouchNumber";
import { pinlessNumber } from "./pinlessNumber";
import { QuickKeysSetup } from "./QuickKeysSetup";
import { CallForwardingSetup } from "./callForwardingSetup";
import { CallHistory } from "./callHistory";

export class planSnapshot
{
    constructor(){}

    PlanDetails: Plan;
    OneTouchSetups: OneTouchNumber[];
    PinlessNumbers: pinlessNumber[];
    QuickKeySetups: QuickKeysSetup[];
    CallForwardingSetups: CallForwardingSetup[];
    CallHistories: CallHistory[]
}