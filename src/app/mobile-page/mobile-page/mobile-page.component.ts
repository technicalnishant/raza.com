import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile-page',
  templateUrl: './mobile-page.component.html',
  styleUrls: ['./mobile-page.component.scss']
})
export class MobilePageComponent implements OnInit {

  constructor() { }
  main_bg_img = '/assets/images/features/testimonial-bg-1.jpg';
  main_bg  = 0;
  data = [
    {
      tab:{
        img:"/assets/images/new_design_images/one_touch_setup.png",
        title:"Call Worldwide",
      },
      heading:"One Touch<br>Setup",
    'page_url':"onetouchSetups",
      subhead:"Call any international number with the touch of a <br> button",
      bg_img: "/assets/images/new_design_images/mobile_page_bg.png",
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
        title:"Top-up",
      },
      heading:"My Numbers",
    'page_url':"mynumber",
      subhead:"Register your calling from number and call direct by using Raza access number.",
      bg_img: "/assets/images/new_design_images/mobile_page_bg.png",
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
        title:"Rewards",
      },
      heading:"Call Details",
    'page_url':"plandetails",
      subhead:"Keep track of your calls, view call details up to 60 days",
      bg_img: "/assets/images/new_design_images/mobile_page_bg.png",
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
        title:"Account Management",
      },
      heading:"100% <br>Money Back",
    'page_url':"",
      subhead:"We sell our product with utmost confidence; so we give 100% money back. Get your free trial today.",
      bg_img: "/assets/images/new_design_images/mobile_page_bg.png",
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
        title:"Support",
      },
      heading:"24/7 Support ",
    'page_url':"autorefill",
      subhead:"We’re always happy to help.",
      subhead2:"Call us at 1-(877) 463-4233",
      bg_img: "/assets/images/new_design_images/mobile_page_bg.png",
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



  ];
  ngOnInit(): void {
  }

  searchRates(){

  }
}
