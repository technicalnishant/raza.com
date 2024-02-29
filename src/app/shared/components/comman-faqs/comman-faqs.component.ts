import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-comman-faqs',
  templateUrl: './comman-faqs.component.html',
  styleUrls: ['./comman-faqs.component.scss']
})
export class CommanFaqsComponent implements OnInit {

  constructor( private auth: AuthenticationService){

  }
  showMore = false;
  showButton = true;
  sliderAutoplay: boolean = true;
   isVisibleFaq(){
    this.showMore = true;
    this.showButton = false;
   }

  

  ngOnInit(): void {
  }

  openLoginPopup()
  {
    this.auth.loginPopup();
  }
}
