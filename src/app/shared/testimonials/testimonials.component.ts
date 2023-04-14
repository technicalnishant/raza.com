
import { Component, OnInit ,NgModule,ViewEncapsulation ,HostListener} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TestimonialsComponent implements OnInit {
  innerWidth:any;
  constructor() { }
  main_bg  = 0;
  prop = 50;
  data = [
    {
      name: "samhere",
      date: "May 14, 2022",
      content: 'Have been using Raza for 7 years now. This app has made it much easier for me to connect with people around the world. Best rates, easy to use, easy to top up....',
      avatar:"./assets/images/testimonials/testm_2.png",
          bg_img: "./assets/images/testimonial-bg-5_d2eb09.webp",
          bg_color:"#4d656f"
    },
    {
      name: "Adebisi Edili Ogaji",
      date: "May 8, 2022",
      content: 'I have been a Raza Customer for about two years now, and have never had any disappointments. I did use other call services in the past but I faced various issues. I recommend to all...',
      avatar:"./assets/images/testimonials/RazaAppIcon_120x120.png",
      bg_img: "./assets/images/testimonial-bg-4_uqze4v.webp",
      bg_color:"#493747"
    },
    {  name: "Uyi Eguavoen",
          date: "May 2, 2022",
          content:"This is my first time using International Calling services through app,I used to use the calling cards,after using Raza Universe App it’s so relief that I don’t have to add any pin no...." ,
          avatar:"./assets/images/testimonials/testm_2.png",
          bg_img: "./assets/images/testimonial-bg-3a_noysfw.webp",
          bg_color:"#e1bd5d"
        },

  
    
    {  name: "J Blessing",
          date: "April 30, 2022",
          content:"I have been using Raza for the last six years and always enjoyed their prompt service and attention. Thanks to all the staff",
          avatar:"./assets/images/testimonials/testm_2.png",
          bg_img: "./assets/images/testimonial-bg-6_objrev.webp",
          bg_color:"#273137"
        },


        {  name: "Kazeem Olusanya",
          date: "April 28, 2022",
          content:"After they updated the app, it's very easy for me to use, it's hassle free I can do the recharge myself, check my profile, balance, purchase and call history." ,
          avatar:"./assets/images/testimonials/testm_1.png",
          bg_img: "./assets/images/testimonial-bg-1_o2x9d9_q58aaf.webp",
          bg_color:"#694957",
        },
        {  name: "Sabir",
          date: "Aug 1,2020",
          content:"Good customer skill, fast response and very cooperative knows the job very well, thanks for prom extra 10%" ,
          avatar:"./assets/images/testimonials/testm_2.png",
          bg_img: "./assets/images/testimonial-bg-5_d2eb09.webp",
          bg_color:"#4d656f"
        }
        /************

  {  name: "jeanine",
          date: "Mar 1,2020",
          content:"Best rates to call democratic republic of Congo ,Send Mobile Top-up through app itself",
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/RazaAppIcon_120x120.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-4_uqze4v.webp",
          bg_color:"#493747"
        },
        {  name: "Sabir",
          date: "Aug 1,2020",
          content:"Good customer skill, fast response and very cooperative knows the job very well, thanks for prom extra 10%" ,
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/testm_2.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-5_d2eb09.webp",
          bg_color:"#4d656f"
        },
        {  name: "Patrick",
          date: "Jan 31,2020",
          content:"This is the best international calling facility. Thank you so much Raza.",
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/testm_2.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-6_objrev.webp",
          bg_color:"#273137"
        },
        {  name: "Gulshan",
          date: "Oct 28,2019",
          content:"Low rates and good service, I recommend Raza.com to all my friends and family members" ,
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/testm_1.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-1_o2x9d9_q58aaf.webp",
          bg_color:"#694957",
        },
        {  name: "Manisha",
          date: "Aug 18,2019",
          content:"Exceptionally good service Great Network, never faced any issues." ,
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/testm_3.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-2_v5anj8.webp",
          bg_color:"#43aec8"
        },
        {  name: "Harsh",
          date: "Aug 17,2019",
          content:"I am with Raza for more than 3 years. Making calls is a great experience with affordable price. I wish i can give more than five stars." ,
          avatar:"https://d2uij5nbaiduhc.cloudfront.net/images/testimonials/testm_2.png",
          bg_img: "https://d2uij5nbaiduhc.cloudfront.net/images/testimonial-bg-3a_noysfw.webp",
          bg_color:"#e1bd5d"
        }
        ***/
      ];



   


 


  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 400){
      this.prop = 140;
    }else if(this.innerWidth > 500){

      this.prop = 100;

    }else if(this.innerWidth < 500 && this.innerWidth > 1050){

      this.prop = 50;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

}
