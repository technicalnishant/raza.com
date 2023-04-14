import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

declare var paypal: any;

@Component({
  selector: 'app-paypal-payment-box',
  templateUrl: './paypal-payment-box.component.html',
  styleUrls: ['./paypal-payment-box.component.scss']
})
export class PaypalPaymentBoxComponent implements OnInit, AfterViewInit {
  
  @ViewChild("paypal-button-container", {read: ElementRef}) paypalButton: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.renderPaypalButton();
  }
  
  renderPaypalButton()
  {
    paypal.Buttons().render(this.paypalButton);
  }

}
