export class Rewards {
    constructor(parameters) {

    }
    EmailId: string;
    Point: number;
}

export class RedeemedPoint {
    constructor(parameters) {

    }
    RedeemDate: Date;
    PointUsed: number;
}

export class EarnedPoint {
    EarnedDate: Date;
    Point: number
}