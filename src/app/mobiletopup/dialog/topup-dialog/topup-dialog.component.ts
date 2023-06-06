import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { MobiletopupService } from '../../mobiletopup.service';
@Component({
  selector: 'app-topup-dialog',
  templateUrl: './topup-dialog.component.html',
  styleUrls: ['./topup-dialog.component.scss']
})
export class TopupDialogComponent implements OnInit {

  countryFrom:any;
  countryTo:any;
  operator:any;
  detailInfo:any
  constructor(private dialogRef: MatDialogRef<TopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private mobiletopupService : MobiletopupService) { }

  ngOnInit(): void 
  {
     this.countryFrom   = this.data.from_id; 
     this.countryTo     = this.data.to_id;
     this.operator      = this.data.operator;
     this.getPopupDetail()
  }

  getPopupDetail()
  {
    this.mobiletopupService.getBundlesInfo(this.countryFrom,this.countryTo ).subscribe(data =>{
      if(data)
      {
        this.detailInfo = data[0];
      }
    })
  }
  
  getValidity()
  {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Novr", "Dec"];
     if(this.detailInfo && this.detailInfo.StartUtc)
     {
        let startDate = new Date(this.detailInfo.StartUtc);
        let endDate = new Date(this.detailInfo.EndUtc);
        let smonth =  months[startDate.getMonth()];
        let emonth =  months[endDate.getMonth()];
        let sday = startDate.getDate();
        let eday = endDate.getDate();

        let date_string = sday+' '+smonth+"-"+eday+' '+emonth;
        return date_string;
    }
  }

close() {
    this.dialogRef.close();
}

htmlStrFixed(str)
{
  return str.replace(/\n/g, "<br />");
}
}
