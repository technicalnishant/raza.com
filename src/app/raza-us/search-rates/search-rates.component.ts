import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/core/services/auth.service';

@Component({
  selector: 'app-search-rates',
  templateUrl: './search-rates.component.html',
  styleUrls: ['./search-rates.component.scss']
})
export class SearchRatesComponent implements OnInit {
  showMore = false;
  showButton = true;
  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
  }
  isVisibleFaq(){
    this.showMore = true;
    this.showButton = false;
   }
   openLoginPopup()
   {
     this.auth.loginPopup();
   }
  }
