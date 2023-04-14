import { Component, OnInit , HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/auth.service';
import { MetaTagsService } from 'app/core/services/meta.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  mode = new FormControl('over');
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  panelOpenState5 = false;
  panelOpenState6 = false;
  panelOpenState7 = false;
  panelOpenState8 = false;
  headerValue : number = 1;
  showMore = false;
  showButton = true;

  constructor(
    private router: Router, 
    private titleService: Title, 
    private metaTagsService:MetaTagsService,
    private auth: AuthenticationService
    ) {
   }

   
   isVisibleFaq(){
    this.showMore = true;
    this.showButton = false;
   }

  ngOnInit() {
    this.titleService.setTitle('Mobile Faq');
    this.metaTagsService.getMetaTagsData('faq');
  }

  openLoginPopup()
   {
     this.auth.loginPopup();
   }
   
  @HostListener('window:scroll', ['$event'])
    checkScroll() {
      const scrollPosition = window.pageYOffset
      
      if(scrollPosition > 5){
        this.headerValue = 2;

      }else{
        this.headerValue = 1;
      }

    }

}
