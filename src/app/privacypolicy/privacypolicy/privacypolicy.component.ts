import { Component, OnInit , HostListener} from '@angular/core';
import {FormControl} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaTagsService } from 'app/core/services/meta.service';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent implements OnInit {

  mode = new FormControl('over');
  headerValue : number = 1;

  constructor(private router: Router, private titleService: Title, private metaTagsService:MetaTagsService) { }

  ngOnInit() {
    this.titleService.setTitle('Privacy Policy'); 
    this.metaTagsService.getMetaTagsData('support');
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
