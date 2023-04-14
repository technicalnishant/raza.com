import { PromotionPlan } from "./promotion-plan";

export class Promotion {
  InstanceId: number;
  PromotionCode: string;
  PromotionName: string;
  CountryFrom: number;
  Icon: string;
  BannerNav: string;
  MobileThumbnail: string;
  LandingPageImage: string;
  IsGroupedPromotion: boolean;
  Template: string;
  Description: string;
  component: string;
  IsPopupView: boolean;
  Plans: PromotionPlan[];

}
