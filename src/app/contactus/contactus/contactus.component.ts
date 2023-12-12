import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { MessageUsComponent } from '../dialog/message-us/message-us.component';
import { SideBarService } from '../../core/sidemenu/sidemenu.service';
import { CallUsComponent } from '../../shared/dialog/call-us/call-us.component';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { MetaTagsService } from 'app/core/services/meta.service';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { CurrentSetting } from 'app/core/models/current-setting';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  mode = new FormControl('over');
  headerValue: number = 1;
  currentSetting: CurrentSetting;
  currenctSetting$: Subscription;
  customerCare:any='';
  constructor(public dialog: MatDialog, private router: Router, private titleService: Title,
    private sideBarService: SideBarService, 
    public snackbar: RazaSnackBarService,
    private metaTagsService:MetaTagsService,private razaEnvService: RazaEnvironmentService,) {
    this.sideBarService.toggle();
  }

  ngOnInit() {
    //this.titleService.setTitle('Contact Us');
    this.metaTagsService.getMetaTagsData('contactus');
    this.customerCare = 'tel:1-877.463.4233';
    
 this.razaEnvService.getCurrentSetting().subscribe(res => {
      this.currentSetting = res;
      this.setcurrentCurrency();
      
    })
  }

  setcurrentCurrency()
  {
    if(this.currentSetting.country.CountryId == 1)
    {
  
      this.customerCare = 'tel:1-877.463.4233';
    }
      
      if(this.currentSetting.country.CountryId == 2)
      {
       
        this.customerCare='tel:1-800.550.3501';
      }
      
      if(this.currentSetting.country.CountryId == 3)
      {
        
        this.customerCare='tel:44 800-041-8192';

      }
     
      if(this.currentSetting.country.CountryId == 8)
      {
         
        this.customerCare='tel:61283173403';
      }
    
      if(this.currentSetting.country.CountryId == 20)
      {
        
        this.customerCare='tel:6498844133';
      }
    
      if(this.currentSetting.country.CountryId == 26)
      {
        
        this.customerCare='tel:1-877.463.4233';
      } 
  }

  callUs() {
    const dialogRef1 = this.dialog.open(CallUsComponent, {
      data: { country: this.currentSetting.country.CountryId},
      
    });
    dialogRef1.afterClosed().subscribe(result => {
    });
  }

  messageUs() {
    const dialogRef2 = this.dialog.open(MessageUsComponent);
    dialogRef2.afterClosed().subscribe(result => {
      if (result === true) {
        this.snackbar.openSuccess("Your message has been submitted successfully. A Raza Representative will contact you shortly or within 24 hours");
      }
    },
      (err: ApiErrorResponse) => console.log(err),
      () => {
      });
  }

}

