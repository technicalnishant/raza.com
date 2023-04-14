import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustomerService } from 'app/accounts/services/customerService';
import { MetaTagsService } from 'app/core/services/meta.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { RazaSnackBarService } from 'app/shared/razaSnackbar.service';



@Component({
  selector: 'app-reffer',
  templateUrl: './reffer.component.html',
  styleUrls: ['./reffer.component.scss']
})
export class RefferComponent implements OnInit {

  mode = new FormControl('over');
  headerValue: number = 1;
  referrerCode:any;
  reffralUrl:string="https://raza.com/ref/";
  
  reff_text : string = `Enjoy FREE International calls with Raza! When you sign up and make your first purchase using my link, we'll both receive $5 credits - absolutely free. Follow this link to get started now!`
  constructor(
    private router: Router, 
    private titleService: Title, 
    private metaTagsService:MetaTagsService,
    private customerService: CustomerService,
    private razaSnackBarService: RazaSnackBarService,
    private razaEnvService: RazaEnvironmentService,
    ) { }

  ngOnInit() {
    this.titleService.setTitle('Refer a friend'); 
    this.metaTagsService.getMetaTagsData('refer-a-friend');
    this.getCode();
  }

  getCode()
  {
      let phone = localStorage.getItem("login_no");
      this.customerService.getReferrerCode(phone).subscribe((res:any) =>  {
      this.referrerCode =  res.ReferrerCode ;
      this.reffralUrl = this.reffralUrl+this.referrerCode;
      
    },
      err => {
        this.razaSnackBarService.openError('There must be some issue while fetching reffral code.');
      }
    );
  }
  shareinstaUrl() {
    window.open('https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content' + encodeURIComponent("Custom Title") + ':%20 ' + encodeURIComponent(this.reffralUrl));
    return false;
  }
}

