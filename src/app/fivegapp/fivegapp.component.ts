import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
@Component({
  selector: 'app-fivegapp',
  templateUrl: './fivegapp.component.html',
  styleUrls: ['./fivegapp.component.scss']
})
export class FivegappComponent implements OnInit {

  constructor(public platform: Platform,) { }

  ngOnInit(): void {
    if (this.platform.ANDROID) {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', '_self')
    } else if (this.platform.IOS) {
      window.open('https://apps.apple.com/us/app/raza-wireless/id6503620113', '_self')
    }
    else {
      window.open('https://play.google.com/store/apps/details?id=com.razacomm.universe', '_self')
    }
  }


 

}
