import { CurrencyCode } from "../../core/interfaces/CurrencyCode";
import { Denominations } from "../../globalrates/model/denominations";
import { Country } from "../../core/models/country.model";
import { TransactionType } from "../../payments/models/transaction-request.model";
import { OperatorDenominations } from "../../mobiletopup/model/operatorDenominations";
import { GenerateTransactionRequestModel } from "../../payments/models/generate-transaction-req.model";
import { ValidateCouponCodeRequestModel } from "../../payments/models/validate-couponcode-request.model";
import { Plan } from "../../accounts/models/plan";

export interface ICheckoutModel {
    transactiontype: TransactionType;
    currencyCode: CurrencyCode;
    couponCode: string;
    isCalculatedServiceFee?: boolean;
    isMandatoryAutorefill?: boolean;
    isAutoRefill?: boolean;
    isHideCouponEdit?: boolean;
    offerPercentage:any;
    getOrderName?(): string;
    getPurchaseAmount?(): number;
    calculateServiceFee?(): number;
    totalAmount?(): number;
    getTransactionReqModel?(): GenerateTransactionRequestModel;
    getValidateCouponCodeReqModel?(couponCode: string): ValidateCouponCodeRequestModel
}

export class NewPlanCheckoutModel implements ICheckoutModel {
    currencyCode: CurrencyCode;
    couponCode: string;
    isAutoRefill?: boolean = false;
    CardId: number;
    CardName: string;
    CurrencyCode: CurrencyCode;
    details: Denominations;
    country: Country;
    phoneNumber: string;
    countryFrom: number;
    countryTo: number;
	isPromotion:boolean=false;
    isCalculatedServiceFee?: boolean;
    isMandatoryAutorefill?: boolean;
    isHideCouponEdit?: boolean;
    pinlessNumbers: string[];
    offerPercentage:any;
    ProcessedBy:string='';
    ActualAmountCharge: number;
    PaymentCurrency :string='';
    calculateServiceFee?(): number {
        if (this.isCalculatedServiceFee === true) {
            return this.details.ServiceCharge;
        } else {
            return Math.round(((this.details.ServiceCharge * this.details.Price) / 100) * 100) / 100;
        }
    }
    totalAmount?(): number {
        return Math.round((this.calculateServiceFee() + this.details.Price) * 100) / 100;
    }
    transactiontype: TransactionType;
    getOrderName?(): string {
        return this.CardName;
    }
    getPurchaseAmount?(): number {
        return this.details.Price;
    }

    getTransactionReqModel?(): GenerateTransactionRequestModel {
        let generateTranreqModel = new GenerateTransactionRequestModel();
        generateTranreqModel.planId = this.details.SubCardId;
        generateTranreqModel.purchaseAmount = this.getPurchaseAmount();
        generateTranreqModel.transactionType = this.transactiontype;
        generateTranreqModel.cardName = this.getOrderName();
        generateTranreqModel.currencyCode = this.currencyCode;
        return generateTranreqModel;
    }

    getValidateCouponCodeReqModel?(couponCode: string): ValidateCouponCodeRequestModel {
        const validateCouponCodeReq: ValidateCouponCodeRequestModel = {
            CouponCode: couponCode,
            CardId: this.CardId,
            CountryFrom: this.countryFrom,
            CountryTo: this.countryTo,
            Price: this.details.Price,
            TransType: this.transactiontype
        }
        return validateCouponCodeReq;
    }
}

export class RechargeCheckoutModel implements ICheckoutModel {
    currencyCode: CurrencyCode;
    transactiontype: TransactionType;
    couponCode: string;
    planId: string;
    cardId: number;
    isAutoRefill?: boolean = false;
    purchaseAmount: number;
    creditCardLastDigit?: string;
    cvv: string;
    planName: string;
    serviceChargePercentage: number;
    countryFrom: number;
    countryTo: number;
    isCalculatedServiceFee?: boolean;
    isMandatoryAutorefill?: boolean;
    isHideCouponEdit?: boolean;
    offerPercentage:any;
    ProcessedBy:string='';
    getOrderName?(): string {
        return this.planName;
    };
    getPurchaseAmount?(): number {
        return this.purchaseAmount;
    };
    calculateServiceFee?(): number {
       // return (this.serviceChargePercentage * this.purchaseAmount) / 100;
        if (this.isCalculatedServiceFee === true) {
           // return this.serviceChargePercentage;
            return  Math.round(((this.serviceChargePercentage) / 100) * 100) / 100;
        } else {
            return Math.round(((this.serviceChargePercentage * this.purchaseAmount) / 100)* 100) / 100;
        }
    }
    totalAmount?(): number {
       
        var fee = this.calculateServiceFee();
        var amount = this.getPurchaseAmount();
       // return (fee*1 )+ (amount*1)
        return Math.round(((fee*1 ) + (amount*1)) * 100) / 100;

       // return  this.calculateServiceFee() + this.getPurchaseAmount();
    }

    getValidateCouponCodeReqModel?(couponCode: string): ValidateCouponCodeRequestModel {
        const validateCouponCodeReq: ValidateCouponCodeRequestModel = {
            CouponCode: couponCode,
            CardId: this.cardId,
            CountryFrom: this.countryFrom,
            CountryTo: this.countryTo,
            Price: this.purchaseAmount,
            TransType: TransactionType.Recharge
        }
        return validateCouponCodeReq;
    }

    getTransactionReqModel?(): GenerateTransactionRequestModel {
        let generateTranreqModel = new GenerateTransactionRequestModel();
        generateTranreqModel.planId = this.planId;
        generateTranreqModel.purchaseAmount = this.getPurchaseAmount();
        generateTranreqModel.transactionType = this.transactiontype;
        generateTranreqModel.cardName = this.getOrderName();
        generateTranreqModel.currencyCode = this.currencyCode;
        return generateTranreqModel;
    }

}

export class MobileTopupCheckoutModel implements ICheckoutModel {
    currencyCode: CurrencyCode;
    transactiontype: TransactionType = TransactionType.Topup;
    country: Country;
    topupOption: OperatorDenominations;
    couponCode: string;
    phoneNumber: string;
    operatorCode: string;
    isCalculatedServiceFee?: boolean;
    isHideCouponEdit?: boolean;
    countryFrom: number;
    offerPercentage:any;
    getOrderName?(): string {
        return 'Mobile Topup';
    }

    getPurchaseAmount?(): number {
        return this.topupOption.UsDenomination;
    }
    calculateServiceFee?(): number {
        return 0;
    };
    totalAmount?(): number {
        return this.calculateServiceFee() + this.getPurchaseAmount();
    };

    getTransactionReqModel?(): GenerateTransactionRequestModel {
        let generateTranreqModel = new GenerateTransactionRequestModel();
        generateTranreqModel.planId = '';
        generateTranreqModel.purchaseAmount = this.getPurchaseAmount();
        generateTranreqModel.transactionType = this.transactiontype;
        generateTranreqModel.cardName = this.getOrderName();
        generateTranreqModel.currencyCode = this.currencyCode;
        return generateTranreqModel;
    }

    getValidateCouponCodeReqModel?(couponCode: string, plan?: Plan): ValidateCouponCodeRequestModel {
        const validateCouponCodeReq: ValidateCouponCodeRequestModel = {
            CouponCode: couponCode,
            CardId: null,
            CountryFrom: plan.CountryFrom,
            CountryTo: plan.CountryTo,
            Price: this.getPurchaseAmount(),
            TransType: TransactionType.Recharge
        }
        return validateCouponCodeReq;
    }

}