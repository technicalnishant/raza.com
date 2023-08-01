import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiErrorResponse } from 'app/core/models/ApiErrorResponse';
import { GlobalPlansData } from 'app/globalrates/model/globalPlansData';
import { GlobalSubPlans } from 'app/globalrates/model/globalSubPlans';
import { Ratedenominations } from 'app/globalrates/model/ratedenominations';
import { Country } from 'app/rates/model/country';
import { SearchRatesService } from 'app/rates/searchrates.service';

@Component({
  selector: 'app-viewrates',
  templateUrl: './viewrates.component.html',
  styleUrls: ['./viewrates.component.scss']
})
export class ViewratesComponent implements OnInit {
  SubPlans: GlobalSubPlans[] = [];
  FilteredSubPlans: GlobalSubPlans[] = [];
  globalPlanData: GlobalPlansData;
  Plans: Ratedenominations[];
  denominationList: any[];
  allCountry: Country[];
  countryFrom:any;
  countryTo:any;
  viewAllrate:boolean=false;
  countryName: any;
  constructor(
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private route: ActivatedRoute,
    private searchRatesService: SearchRatesService,
  ) { }

  ngOnInit(): void {
    this.countryFrom = this.data.countryFrom
    this.countryTo = this.data.countryFrom
    this.globalPlanData = this.data.globalPlanData
    this. viewAllRatesTab();
  }



  viewAllRatesTab() {
     
    this.searchRatesService.getSearchGlobalRatesSubPlans(this.countryFrom, this.countryTo).subscribe(
      (data: any) => {
        this.SubPlans = data
        if (this.SubPlans.length > 0) 
        {
         this.denominationList = Array.from(new Set(this.SubPlans.map(item => item.Price)));
         this.denominationList = this.denominationList.sort( (a, b)=> a-b)

         
        // this.denominationList = this.denominationList.filter(a=> a != 90 )

          console.log('this.denominationList', this.denominationList);
        
             
          this.filterDetailRate(this.denominationList[0]);
          this.viewAllrate = true;
         // this.matContent.nativeElement.scrollTop = 500;
        }
        
      }
      , (err: ApiErrorResponse) => console.log(err));
  }

  filteredItems(price: number) {
    //this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price); 
    let plans_list = this.SubPlans;
    let plan_info = plans_list.filter(a => a.Price == price);
    plan_info = plan_info.sort((a, b) => {
      const countryNameA = a.CountryName.toLowerCase();
      const countryNameB = b.CountryName.toLowerCase();
      
      if (countryNameA < countryNameB) {
        return -1;
      }
      if (countryNameA > countryNameB) {
        return 1;
      }
      
      return 0;
    })
 
    return plan_info;
  }
  filterDetailRate(price: number) {
    //this.FilteredSubPlans = this.SubPlans.filter(a => a.Price == price); 
    
    let plan_info = this.SubPlans.filter(a => a.Price == price);
   
     this.FilteredSubPlans = plan_info.sort((a, b) => {
      const countryNameA = a.CountryName.toLowerCase();
      const countryNameB = b.CountryName.toLowerCase();
      
      if (countryNameA < countryNameB) {
        return -1;
      }
      if (countryNameA > countryNameB) {
        return 1;
      }
      
      return 0;
    })
    

  }



  getTotalMin1(item, price)
{
 
if(item.Price == price)
{
  return item.DiscountedRate.TotalTime + item.DiscountedRate.PromoMinutes;
}
 

   
   
}


  getTotalMin(min, promomin, price)
  {
      
       return Math.floor(min+ promomin);
       
     
  }
  getNameOfCountry(obj){
    if(obj == this.countryName)
    {
      return obj+' landline'
    }
    else
    return obj;
  }


  getClassIcon(obj)
  {
    if(obj == this.countryName)
    {
      return 'landline_icon';
    }

    else if(obj == this.countryName+' Mobile')
    {
      return 'mobile_icon';
    }
    else
    {
      return '';
    }

  }

}
