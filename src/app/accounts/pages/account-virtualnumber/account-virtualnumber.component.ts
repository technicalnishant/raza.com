import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RazaLayoutService } from '../../../core/services/raza-layout.service';

@Component({
  selector: 'app-account-virtualnumber',
  templateUrl: './account-virtualnumber.component.html',
  styleUrls: ['./account-virtualnumber.component.scss']
})
export class AccountVirtualnumberComponent implements OnInit {

  constructor(private titleService: Title,
    private razalayoutService: RazaLayoutService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Virtual Number');
    this.razalayoutService.setFixedHeader(true);
  }

  virtualNumberPopup() { }
}
