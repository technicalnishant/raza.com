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

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  mode = new FormControl('over');
  headerValue: number = 1;

  constructor(public dialog: MatDialog, private router: Router, private titleService: Title,
    private sideBarService: SideBarService, 
    public snackbar: RazaSnackBarService,
    private metaTagsService:MetaTagsService,) {
    this.sideBarService.toggle();
  }

  ngOnInit() {
    //this.titleService.setTitle('Contact Us');
    this.metaTagsService.getMetaTagsData('contactus');
  }

  callUs() {
    const dialogRef1 = this.dialog.open(CallUsComponent);
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

