import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MetaTagsService } from 'app/core/services/meta.service';

@Component({
  selector: 'app-referafriend',
  templateUrl: './referafriend.component.html',
  styleUrls: ['./referafriend.component.scss']
})
export class ReferafriendComponent implements OnInit {

  mode = new FormControl('over');
  headerValue: number = 1;
  // fillerNav = [ 'INTERNATIONAL CALLING' , 'MOBILE TOP-UP' , 'CALL ME LOCAL' , 'SIGNUP / LOGIN' , 'RECHARGE' , 'LIVE CHAT' , 'CONTACT US' ];

  constructor(private router: Router, private titleService: Title, private metaTagsService:MetaTagsService) { }

  ngOnInit() {
    this.titleService.setTitle('Refer a friend'); 
    this.metaTagsService.getMetaTagsData('refer-a-friend');
  }

}
