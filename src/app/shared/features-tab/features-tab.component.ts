import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
 
 
import { HowWorksComponent } from '../dialog/how-works/how-works.component';
import { FaqPageComponent } from '../dialog/faq-page/faq-page.component';
import { AuthenticationService } from '../../core/services/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Plan } from '../../accounts/models/plan';
import { PlanService } from '../../accounts/services/planService';
import { LoginpopupComponent } from '../../core/loginpopup/loginpopup.component';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { CurrentSetting } from 'app/core/models/current-setting';
import { Subscription } from 'rxjs';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
@Component({
  selector: 'app-features-tab',
  templateUrl: './features-tab.component.html',
  styleUrls: ['./features-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class FeaturesTabComponent implements OnInit {

  headerValue: number = 1;
  id: number = 1;
  plan: Plan;
  slideIndex: number = 0;
  slideIndexVal: number = 0;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;
  isAuthenticated: boolean = false;
  plan_id:string;
  clickable_tab : number=0;
  currentSetting: CurrentSetting;
  currentSetting$: Subscription;
  constructor(
  public dialog: MatDialog,
  private planService: PlanService,
  private router: Router,
  private authService: AuthenticationService,
  private razaEnvService: RazaEnvironmentService,
  public loginDialog: MatDialog,) {
	this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
		this.currentSetting = res;
		 
	  })
  }
  main_bg_img = '/assets/images/features/testimonial-bg-1.jpg';
  main_bg  = 0;

  data:any = [];
  



  ngOnInit(): void {
  if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
	  
		  this.planService.getAllPlans().subscribe(
		  (data: Plan[]) => {
			this.plan = data[0];
			this.plan_id = this.plan.PlanId;
			 
		  },
		  (err: ApiErrorResponse) => {
			console.log(err)
			 
			}
		);
		 
    }


	this.clickable_tab = (history.state.slid)?history.state.slid:0;
	if(this.clickable_tab > 0)
	{
		this.main_bg = this.clickable_tab;
	}

	this.setToArray()
	
  }
    setToArray()
	{
		if(this.currentSetting.currentCountryId <= 3)
		{
			this.data = [
				{
					tab:{
						img:"/assets/images/new_design_images/one_touch_setup.png",
						title:"ONE TOUCH SETUP",
					},
					heading:"One Touch<br>Setup",
				  'page_url':"onetouchSetups",
					subhead:"Call any international number with the touch of a <br> button",
					bg_img: "/assets/images/testimonial-bg-3a_noysfw.webp",
					img_list:[
							{img: "/assets/images/free_tag_icon.svg",tool:"It's Free",img_hover:"/assets/images/free_tag_icon_white.svg"},
				{img: "/assets/images/call_made_icon.svg",tool:"As easy as making a local call",img_hover:"/assets/images/call_made_icon_white.svg"},
				{img: "/assets/images/list_icon.svg",tool:"Pic your favorite number from huge database",img_hover:"/assets/images/list_icon_white.svg"},
				{img: "/assets/images/global_icon.svg",tool:"Call any country in the with one touch dial",img_hover:"/assets/images/global_icon_white.svg"},
							],
					  button:[
								  {label:'SET IT UP NOW',link:"/auth/sign-up",primary:true},
								  {label:'How it works?',link:"#",primary:false},
								  {label:'FAQ',link:"#",primary:false},
							  ]
  
				},
				{
					tab:{
						img:"/assets/images/new_design_images/my_number.png",
						title:"MY NUMBERS",
					},
					heading:"My Numbers",
				  'page_url':"mynumber",
					subhead:"Register your calling from number and call direct by using Raza access number.",
					bg_img: "/assets/images/featured-bg-2.webp",
					img_list:[
							{img:	"/assets/images/no_pin_icon_grey.svg",tool:"No pin #' to dial",img_hover:"/assets/images/no_pin_icon_white.svg"},
							{img:  	"/assets/images/add_number_icon_grey.svg",tool:"Just add your number and start calling",img_hover:"/assets/images/add_number_icon_white.svg"},
							{img:  	"/assets/images/use_phone_grey_icon.svg",tool:"Use any Phone",img_hover:"/assets/images/use_phone_icon_white.svg"},
							{img:  	"/assets/images/pin_5_icon.svg",tool:"Register upto 5 number to pin-less",img_hover:"/assets/images/pin_5_icon_white.svg"},
							],
					button:[
								{label:'SET IT UP NOW',link:"#",primary:true},
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				},
				{
					tab:{
						img:"/assets/images/new_design_images/call_details.png",
						title:"Call Details",
					},
					heading:"Call<br>Details",
				  'page_url':"plandetails",
					subhead:"Keep track of your calls, view call details up to 60 days",
					bg_img: "/assets/images/testimonial-bg-4_uqze4v.webp",
					img_list:[
								{img: "/assets/images/total_transparency_icon.svg",tool:"Total Transparency",img_hover:"/assets/images/total_transparency_icon_white.svg"},
								{img: "/assets/images/breakdown_icon.svg",tool:"Detailed breakdown of calls",img_hover:"/assets/images/breakdown_icon_white.svg"},
								{img: "/assets/images/manage_24_icon.svg",tool:"Manage 24/7 ,365 Days",img_hover:"/assets/images/manage_24_icon_white.svg"},
								{img: "/assets/images/always_available_icon.svg",tool:"Available 60 days call history",img_hover:"/assets/images/always_available_icon_white.svg"}
							],
					button:[
								{label:'VIEW DETAILS',link:"#",primary:true},
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				},
				{
					tab:{
						img:"/assets/images/new_design_images/money_back_100.png",
						title:"100% MONEY BACK",
					},
					heading:"100%<br>Money Back",
				  'page_url':"", 
					subhead:"We sell our product with utmost confidence; so we give 100% money back. Get your free trial today.",
					bg_img: "/assets/images/money_back_bg.webp",
					img_list:[
							{img:	"/assets/images/full_refund_icon.svg",tool:"Get full refund",img_hover:"/assets/images/full_refund_icon_white.svg"},
							{img:	"/assets/images/best_quality_icon.svg",tool:"Best quality guaranteed",img_hover:"/assets/images/best_quality_icon_white.svg"},
							{img:	"/assets/images/no_question_icon.svg",tool:"No question asked",img_hover:"/assets/images/no_question_icon_white.svg"},
							{img:	"/assets/images/best_service_icon.svg",tool:"Best service guaranteed",img_hover:"/assets/images/best_service_icon_white.svg"},
							],
					button:[  							
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				},
				{
					tab:{
						img:"/assets/images/new_design_images/auto_rifill.png",
						title:"AUTO REFILL",
					},
					heading:"Auto<br>Refill",
				  'page_url':"autorefill",
					subhead:"Insufficient credit? No more worries!",
					bg_img: "/assets/images/autorefill-bg.webp",
					img_list:[
							{img:	"/assets/images/auto_refil_icon.svg",tool:"Auto-refill at low balance",img_hover:"/assets/images/auto_refil_icon_white.svg"},
							{img:	"/assets/images/easy_manage_icon.svg",tool:"Easy to manage online",img_hover:"/assets/images/easy_manage_icon_white.svg"},
							{img:	"/assets/images/save_time_icon.svg",tool:"Save time",img_hover:"/assets/images/save_time_icon_white.svg"},
							{img:	"/assets/images/get_bonus_icon.svg",tool:"Get bonus minutes on every recharge",img_hover:"/assets/images/get_bonus_icon_white.svg"},
							],
					button:[
								{label:'SET IT UP NOW',link:"#",primary:true},
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				},
				{
					tab:{
						img:"/assets/images/new_design_images/call_forwarding.png",
						title:"CALL FORWARDING",
					},
   
					heading:"Call Forwarding",
				  'page_url':"callForwardingSetups",
   
					subhead:"Never miss a call even when travelling or on vacation, Forward your calls and receive it anywhere. ",
					bg_img: "/assets/images/call_forwarding.webp",
					img_list:[
							{img:	"/assets/images/forward_call_icon.svg",tool:"Forward personal and bussiness calls", img_hover:"/assets/images/forward_call_icon_white.svg"},
							{img:	"/assets/images/avoid_roaming_icon.svg",tool:"Avoid roaming charges", img_hover:"/assets/images/avoid_roaming_icon_white.svg"},
							{img:	"/assets/images/excelent_rate_icon.svg",tool:"Excellent Rates", img_hover:"/assets/images/excelent_rate_icon_white.svg"},
							{img:	"/assets/images/get_personal_1800_icon.svg",tool:"Get Personal 1-800 number", img_hover:"/assets/images/get_personal_1800_icon_white.svg"},
							],
					button:[
								{label:'SET IT UP NOW',link:"#",primary:true},
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				},
				{
					tab:{
						img:"/assets/images/new_design_images/raza_reward_f.png",
						title:"RAZA REWARDS",
					},
					heading:"Raza <br> Rewards",
				  'page_url':"rewards",
					subhead:"It's never too late, enroll to Raza rewards today and get free minutes.",
					bg_img: "/assets/images/testimonial-bg-1_o2x9d9_q58aaf.webp",
					img_list:[
							{img:	"/assets/images/free_bonus_icon.svg",tool:"Free 200 bonus points", img_hover:"/assets/images/free_bonus_icon_white.svg"},
							{img:	"/assets/images/refer_friend_icon.svg",tool:"Refer a friend and earch 250 points", img_hover:"/assets/images/refer_friend_icon_white.svg"},
							{img:	"/assets/images/earn_points_4_icon.svg",tool:"Earn 4 poiint on every $ spent", img_hover:"/assets/images/earn_points_4_icon_white.svg"},
							{img:	"/assets/images/free_mins_icon.svg",tool:"Combine your points and redeem for free mins", img_hover:"/assets/images/free_mins_icon_white.svg"},
							],
					button:[
								{label:'SIGNUP OR VIEW',link:"#",primary:true},
								{label:'How it works?',link:"#",primary:false},
								{label:'FAQ',link:"#",primary:false},
							]
				}
  
			];
		}
	 else{
		this.data = [
			 
			{
				tab:{
					img:"/assets/images/new_design_images/my_number.png",
					title:"MY NUMBERS",
				},
				heading:"My Numbers",
			  'page_url':"mynumber",
				subhead:"Register your calling from number and call direct by using Raza access number.",
				bg_img: "/assets/images/featured-bg-2.webp",
				img_list:[
						{img:	"/assets/images/no_pin_icon_grey.svg",tool:"No pin #' to dial",img_hover:"/assets/images/no_pin_icon_white.svg"},
						{img:  	"/assets/images/add_number_icon_grey.svg",tool:"Just add your number and start calling",img_hover:"/assets/images/add_number_icon_white.svg"},
						{img:  	"/assets/images/use_phone_grey_icon.svg",tool:"Use any Phone",img_hover:"/assets/images/use_phone_icon_white.svg"},
						{img:  	"/assets/images/pin_5_icon.svg",tool:"Register upto 5 number to pin-less",img_hover:"/assets/images/pin_5_icon_white.svg"},
						],
				button:[
							{label:'SET IT UP NOW',link:"#",primary:true},
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			},
			{
				tab:{
					img:"/assets/images/new_design_images/call_details.png",
					title:"Call Details",
				},
				heading:"Call<br>Details",
			  'page_url':"plandetails",
				subhead:"Keep track of your calls, view call details up to 60 days",
				bg_img: "/assets/images/testimonial-bg-4_uqze4v.webp",
				img_list:[
							{img: "/assets/images/total_transparency_icon.svg",tool:"Total Transparency",img_hover:"/assets/images/total_transparency_icon_white.svg"},
							{img: "/assets/images/breakdown_icon.svg",tool:"Detailed breakdown of calls",img_hover:"/assets/images/breakdown_icon_white.svg"},
							{img: "/assets/images/manage_24_icon.svg",tool:"Manage 24/7 ,365 Days",img_hover:"/assets/images/manage_24_icon_white.svg"},
							{img: "/assets/images/always_available_icon.svg",tool:"Available 60 days call history",img_hover:"/assets/images/always_available_icon_white.svg"}
						],
				button:[
							{label:'VIEW DETAILS',link:"#",primary:true},
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			},
			{
				tab:{
					img:"/assets/images/new_design_images/money_back_100.png",
					title:"100% MONEY BACK",
				},
				heading:"100%<br>Money Back",
			  'page_url':"", 
				subhead:"We sell our product with utmost confidence; so we give 100% money back. Get your free trial today.",
				bg_img: "/assets/images/money_back_bg.webp",
				img_list:[
						{img:	"/assets/images/full_refund_icon.svg",tool:"Get full refund",img_hover:"/assets/images/full_refund_icon_white.svg"},
						{img:	"/assets/images/best_quality_icon.svg",tool:"Best quality guaranteed",img_hover:"/assets/images/best_quality_icon_white.svg"},
						{img:	"/assets/images/no_question_icon.svg",tool:"No question asked",img_hover:"/assets/images/no_question_icon_white.svg"},
						{img:	"/assets/images/best_service_icon.svg",tool:"Best service guaranteed",img_hover:"/assets/images/best_service_icon_white.svg"},
						],
				button:[  							
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			},
			{
				tab:{
					img:"/assets/images/new_design_images/auto_rifill.png",
					title:"AUTO REFILL",
				},
				heading:"Auto<br>Refill",
			  'page_url':"autorefill",
				subhead:"Insufficient credit? No more worries!",
				bg_img: "/assets/images/autorefill-bg.webp",
				img_list:[
						{img:	"/assets/images/auto_refil_icon.svg",tool:"Auto-refill at low balance",img_hover:"/assets/images/auto_refil_icon_white.svg"},
						{img:	"/assets/images/easy_manage_icon.svg",tool:"Easy to manage online",img_hover:"/assets/images/easy_manage_icon_white.svg"},
						{img:	"/assets/images/save_time_icon.svg",tool:"Save time",img_hover:"/assets/images/save_time_icon_white.svg"},
						{img:	"/assets/images/get_bonus_icon.svg",tool:"Get bonus minutes on every recharge",img_hover:"/assets/images/get_bonus_icon_white.svg"},
						],
				button:[
							{label:'SET IT UP NOW',link:"#",primary:true},
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			},
			{
				tab:{
					img:"/assets/images/new_design_images/call_forwarding.png",
					title:"CALL FORWARDING",
				},

				heading:"Call Forwarding",
			  'page_url':"callForwardingSetups",

				subhead:"Never miss a call even when travelling or on vacation, Forward your calls and receive it anywhere. ",
				bg_img: "/assets/images/call_forwarding.webp",
				img_list:[
						{img:	"/assets/images/forward_call_icon.svg",tool:"Forward personal and bussiness calls", img_hover:"/assets/images/forward_call_icon_white.svg"},
						{img:	"/assets/images/avoid_roaming_icon.svg",tool:"Avoid roaming charges", img_hover:"/assets/images/avoid_roaming_icon_white.svg"},
						{img:	"/assets/images/excelent_rate_icon.svg",tool:"Excellent Rates", img_hover:"/assets/images/excelent_rate_icon_white.svg"},
						{img:	"/assets/images/get_personal_1800_icon.svg",tool:"Get Personal 1-800 number", img_hover:"/assets/images/get_personal_1800_icon_white.svg"},
						],
				button:[
							{label:'SET IT UP NOW',link:"#",primary:true},
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			},
			{
				tab:{
					img:"/assets/images/new_design_images/raza_reward_f.png",
					title:"RAZA REWARDS",
				},
				heading:"Raza <br> Rewards",
			  'page_url':"rewards",
				subhead:"It's never too late, enroll to Raza rewards today and get free minutes.",
				bg_img: "/assets/images/testimonial-bg-1_o2x9d9_q58aaf.webp",
				img_list:[
						{img:	"/assets/images/free_bonus_icon.svg",tool:"Free 200 bonus points", img_hover:"/assets/images/free_bonus_icon_white.svg"},
						{img:	"/assets/images/refer_friend_icon.svg",tool:"Refer a friend and earch 250 points", img_hover:"/assets/images/refer_friend_icon_white.svg"},
						{img:	"/assets/images/earn_points_4_icon.svg",tool:"Earn 4 poiint on every $ spent", img_hover:"/assets/images/earn_points_4_icon_white.svg"},
						{img:	"/assets/images/free_mins_icon.svg",tool:"Combine your points and redeem for free mins", img_hover:"/assets/images/free_mins_icon_white.svg"},
						],
				button:[
							{label:'SIGNUP OR VIEW',link:"#",primary:true},
							{label:'How it works?',link:"#",primary:false},
							{label:'FAQ',link:"#",primary:false},
						]
			}

		];
	}
} 
	
	
	howItWorksPopup(obj) {
	 
    this.dialog.open(HowWorksComponent, {
     
      data: { slideIndex: obj }
    });
  }
 
  faqPopup(obj) {
    this.dialog.open(FaqPageComponent, {
      data: { slideIndex: obj }
    });
  }
 
 setitUp(obj)
	{
		if (this.authService.isAuthenticated()) {
		
		var page_path = this.data[obj].page_url;
		if(this.data[obj].page_url != 'rewards')
		page_path = "account/"+page_path+"/"+this.plan_id;
		else
		page_path = "account/"+page_path;
		//console.log(page_path);
		  this.router.navigate([page_path])
		 //this.router.navigate(['account/overview'])
		}
		else
		{
		//this.router.navigate(['auth/sign-up']);
		if(obj == 6)
		{
			localStorage.setItem('redirect_path', 'account/rewards');
		}
		else
		{
			localStorage.removeItem('redirect_path');
		}
		this.signupModal('account', this.data[obj].page_url);
		}
	} 
  
	signupModal(obj, obj1) 
	{

		this.dialog.open(LoginpopupComponent, {
			data: { redirect_path:obj1, module:obj}
		});
	}
}
