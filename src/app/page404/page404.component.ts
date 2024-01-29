import { Component, OnInit , HostListener } from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Buy1get1Component } from 'app/core/dialog/buy1get1/buy1get1.component';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss']
})
export class Page404Component implements OnInit {

  mode = new FormControl('over');
  headerValue : number = 1;

  constructor(private router: Router, private titleService: Title, public dialog: MatDialog) { }

  ngOnInit() {
    this.titleService.setTitle('Page not found!');

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

    buyOnegetOne()
    {
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.panelClass = "tryUsFree";
      dialogConfig.width = "100%";
      dialogConfig.height = "90%";
      dialogConfig.data = {
        name: "buy1get1",
        title: "Buy1 Get1", 
      }
      const modalDialog = this.dialog.open(Buy1get1Component, dialogConfig);
    }

}
