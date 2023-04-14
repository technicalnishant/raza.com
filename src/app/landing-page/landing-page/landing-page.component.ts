import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageUsComponent } from '../dialog/message-us/message-us.component';
import { MessageUsAllComponent } from '../dialog/message-us-all/message-us-all.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  mode = new FormControl('over');
  headerValue: number = 1;

  // constructor(private router: Router, private titleService: Title) { }
  constructor(public dialog: MatDialog, private router: Router, private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle('Terms and Condition');
  }

  messageUs() {
    const dialogRef2 = this.dialog.open(MessageUsComponent);
    dialogRef2.afterClosed().subscribe(result => {
    });
  }
  messageUs2() {
    const dialogRef2 = this.dialog.open(MessageUsAllComponent);
    dialogRef2.afterClosed().subscribe(result => {
    });
  }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset

    if (scrollPosition > 5) {
      this.headerValue = 2;

    } else {
      this.headerValue = 1;
    }

  }

}
