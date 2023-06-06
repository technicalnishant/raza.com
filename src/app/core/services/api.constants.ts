import { environment } from '../../../environments/environment';
import { Config } from '../../app.config';


const base = environment.apiHost;
const websiteHost = environment.websiteHost;

export class Api {
	envCountry: any;

	static customer = {
		referFriend: base + 'api/customers/refer',
		referFriendnew: base + 'api/customers/ReferToEmail'
	};
 
	static auth = {
		isInRole: base + 'api/auth/IsInRole/',
		token: base + 'api/auth/token',
		forgotPassword: base + 'api/auth/ForgotPassword/',
		resetPassword: base + 'api/auth/ResetPassword/',
		otp: base + 'api/auth/otp',
		otpRegister: base + 'api/auth/register/otp',
		verifyOtp: base + 'api/auth/otp/verify',
		updatePassword: base + 'api/auth/UpdatePassword',
		register: base + 'api/Customers/Register',
		isExist: base + 'api/auth/IsExist',
		geoCountry: base + 'api/auth/Location',
		defaultCountry: base + 'api/auth/Location/default',
		myCountry: base + 'api/auth/Location/default1',
		sendpasswordlink: base + 'api/customers/sendpasswordlink',
		//api/customers/Register_V1 
		register_v1: base + 'api/Customers/Register_V1',
	};

	static plan = {
		getPlan: base + "api/Plan",
		getCustomPlan: base + "api/Plan",
		onetouchSetup: base + "api/OnetouchSetups",
		QuickKeySetup: base + "api/QuickKeysSetups",
		pinlessNumber: base + "api/Plan/PinlessNumeber",
		pinStatus: base + "api/Plan/PinStatus"
	};


	static accessNumbers = {
		accessNumber: base + "api/AccessNumbers",
	}; 
	static moto = {
		generateMotoOrder: base + "api/Transactions/GenerateMotoOrder",
		//newPin: base + 'api/IssueNewPin/MOTO/ProcessNewPin',
		newPin: base + 'api/IssueNewPin/ProcessMOTONewPin'
	};
	 
	static myAccount = {
		accessNumber: base + "api/AccessNumbers",
		orderHistory: base + "api/FullOrderHistory",
		orderHistory_old: base + "api/OrderHistory",
		fullHistory: base + "api/FullOrderHistory",
		newOrderHistory:base+"api/OrderHistory/Filter",
		customers: base + "api/Customers",
		creditCard: base + "api/Customers/CreditCards",
		//creditCard: base + "api/Customers/CompleteCreditcards",
		removeCreditCard: base + "api/Customers/RemoveCreditCard",

		getcreditCard: base + "api/Customers/CreditCards",
		getBillingInfo: base + "api/Customers/BillingInfo",
		emailSubscription: base + 'api/EmailSubscription/GetSubs',
		updateSubscription: base + 'api/EmailSubscription/UpdateSubscription',
		completeCreditcards : base + 'api/customers/completeCreditcards',
		saveCompleteCreditcard : base + 'api/Customers/SaveCompleteCreditcard_V1',
	}
 
	static callForwarding = {
		CallForwardingSetup: base + "api/CallForwardingSetups",
		deleteCallForwardingSetup: base + "api/CallForwardingSetups",
	} 
	static pinless = {
		PinlessSetup: base + "api/PinlessSetups",
		deletePinless: base + "api/PinlessSetups/delete",
		getPinLess: base + "api/PinlessSetups",
	}
	 
	static rewards = {
		totalRewards: base + "api/Customers/RewardPoints",
		friendsRefered: base + "api/Customers/ReferedFriends",
		pointsRedeemed: base + "api/Customers/RedeemedPoints",
		earnedPoints: base + "api/Customers/RazaRewardPoints",
		rechargeOptions: base + "api/Rewards/recharge-Options",
		redeemPoints: base + "api/Rewards/redeem-points",
		rewardSignUp: base + "api/Customers/RewardSignUp",
		getReferrerCode: base + "api/Customers/GetReferrerCode",
		 
	}

	static oneTouch = {
		onetouchSetup: base + "api/OnetouchSetups",
		onetouchSetupDelete: base + "api/OnetouchSetups/delete",
	}

	static deals = {
		getAllDeals: base + "api/Deals",
		getDealPramotionId: base + "/api/Deals",
		getCountryPramotion: base + "/api/Deals/countryTo",
		getPromotionPlan: base + "/api/Deals",
		getDealCallAsia: base + "/api/Rates/Asia",
		getDealCallAfrica: base + "/api/Rates/Africa"
	}

	static Promotions = {
		get: base + 'api/Promotions'
	}
 
	static rates = {
		getSearchRates: base + "api/Rates/Lowests/",
		getPopularRates: base + "api/Rates/AllCountries?countryFrom=",
		//getSearchGlobalRates: base + "api/Rates/Plans/",
		 //getSearchGlobalRates: base + "api/rates/Plans/LowestRate/",
		 getSearchGlobalRates: base + "api/rates/Plans/LowestRate/v1/",
		//getSearchGlobalRatesSubPlans: base + "api/Rates/SubPlans/",
		//getSearchGlobalRatesSubPlans: base + "api/Rates/SubPlans/v1/",
		getSearchGlobalRatesSubPlans: base + "api/Rates/GetSubPlansWithDistinctRate/",

		getPopularDestinationPlans: base + "api/rates/PopularDestination/",
		getXChageRateInfo: base + "api/Countries/XChageRateInfo/"
	};
	 
	static countries = {
		//getTopThreeCountries: base + "api/Countries/From",
		// getCallDetails: base + "api/Rates/Lowests/",
		 //getCallDetails: base + "api/Rates/lowestrate/",
		getCallDetails: base + "api/Rates/Lowest/v1/",
		getAllCountries: base + "api/Countries/To/0",
		getAllPostalCodes: base + "api/Countries",
		base: base + "api/Countries"
	};

	static freetrials = {
		freetrial: base + "/api/Rates/FreeTrials"
	};
	 
	static quicklink = {
		postfeedback: base + "api/Customers/Feedback",
		getfeedbacklist: base + "api/Complaints/IssueList/Online",
		CreateTicket: base + "api/Complaints/CreateTicket"
	};

	static autoRefill = {
		postAutoRefill: base + "api/AutoRefillSetups",
		getAutoRefill: base + "api/AutoRefillSetups",
		deleteAutoRefill: base + "api/AutoRefillSetups"
	};

	static company = {
		becomeapartner: base + "api/Complaints/BecomePartner",
		messageUs: base + "api/Complaints/Message"
	};
	 
	static mobiletopup = {
		//PhoneNumberInfo: base + "api/MobileTopups/PhoneNumberInfo",
		//https://restapi.razacomm.com/api/MobileTopups/PhoneNumberInfo_V2/{countryFrom}/{phoneNumber}
		PhoneNumberInfo: base + "api/MobileTopups/PhoneNumberInfo_v2",
		getOperatorsDenomination:base+"api/MobileTopups/GetTopUpInfo", /***To get denomination operator wise https://restapi.razacomm.com/api/MobileTopups/GetTopUpInfo/{countryFrom}/{countryTo}/{operatorName} **/
		mobiletopup: base + "api/MobileTopup",
		getBundlesInfo:base + "api/MobileTopups/GetTopUpInfo_V1",
		getBundlesDetail:base + "api/MobileTopups/GetTopUpPromotions"
	};

	static features = {
		setItUp: base + "api/Rates/AllCountries?countryFrom=1"
	};
	 
	static recharge = {
		process: base + 'api/recharge',
		processMobile: base + 'api/recharge/MobileApp',
		processGlobal: base + 'api/recharge/v1/MobileApp',
		getAmount: base + "api/recharge/amounts",
		getWebAmount: base + "api/recharge/MobileAppAmounts"
	}
	static acivation = {
		newPin: base + 'api/IssueNewPin',
	}
 
	static transactions = {
		init: base + "api/transactions/init",
		generate: base + "api/transactions/generate",
		generatePaypalOrder: base + "api/transactions/Paypal/generate",
		iscentinelBypass: base + "api/transactions/IsCentinelBypass",
		process: base + "api/transactions/process",
		validateCoupon: base + "api/transactions/IsValidCouponCode",
		processor: base + "api/Transactions/GetProcessorInfo",
		newProcessor: base + "api/Transactions/GetProcessorInfo_V1/",
	}
 
	static support = {
		sendAppLink: base + "api/Support/AppLink",
		becomePartner: base + "api/Support/BecomePartner",
		env: base + "api/Support/env"
	}
	
	static braintree = {
		//generateToken: base + "api/BrainTree/GenerateToken",
		generateToken: base + "api/BrainTree/GetClientToken",
		createPurchase: base + "api/BrainTree/createpurchase",
		createNonce: base + "api/BrainTree/GetNonce" 
		
	}
	

	static angularApplicationAddress = websiteHost;
	static webApiApplicationAddress = base;
}
