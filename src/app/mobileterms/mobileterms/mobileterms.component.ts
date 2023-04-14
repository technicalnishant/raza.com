import { Component, OnInit , HostListener} from '@angular/core';
import {FormControl} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaTagsService } from 'app/core/services/meta.service';

@Component({
  selector: 'app-mobileterms',
  templateUrl: './mobileterms.component.html',
  styleUrls: ['./mobileterms.component.scss']
})
export class MobiletermsComponent implements OnInit {

  mode = new FormControl('over');
  headerValue : number = 1;

  constructor(private router: Router, private titleService: Title, private metaTagsService:MetaTagsService) { }

  ngOnInit() {
    this.titleService.setTitle('Mobile terms'); 
    this.metaTagsService.getMetaTagsData('mobileterms');
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
