import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-type-icon',
  templateUrl: './card-type-icon.component.html',
  styleUrls: ['./card-type-icon.component.scss']
})
export class CardTypeIconComponent implements OnInit {

  constructor() { }

  @Input() cardType: string;
  ngOnInit() {
    //console.log(this.cardType);
  }

}
