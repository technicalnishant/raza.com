import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CurrentSetting } from 'app/core/models/current-setting';
import { RazaEnvironmentService } from 'app/core/services/razaEnvironment.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-call-us',
  templateUrl: './call-us.component.html',
  styleUrls: ['./call-us.component.scss']
})
export class CallUsComponent {
  country_id:number=1;
  currentSetting$: Subscription;
  currentSetting: CurrentSetting;
  selectedCountry = 1;
  filteredContacts:any = [{
    country_id: 1,
    country: "United States",
    numbers: [
        "1-877.463.4233",
        "1-773.792.8150"
    ],
    qrCodeData: "tel:+18774634233"
}];

   contactDetails:any = [
    {
        country_id: 1,
        country: "United States",
        numbers: [
            "1-877.463.4233",
            "1-773.792.8150"
        ],
        qrCodeData: "tel:+18774634233"
    },
    {
        country_id: 2,
        country: "Canada",
        numbers: [
            "1-800.550.3501",
            "1-416-746-9797"
        ],
        qrCodeData: "tel:+18005503501"
    },
    {
        country_id: 3,
        country: "England",
        numbers: [
            // "+44 800-520-0329", // Commented out
            "+44 800-041-8192",
            "+44 207-100-3090"
        ],
        qrCodeData: "tel:+448000418192"
    },
    {
        country_id: 20,
        country: "New Zealand",
        numbers: [
            "+61-(28) 3173403"
        ],
        qrCodeData: "tel:+61283173403"
    },
    {
      country_id: 8,
      country: "Australia",
      numbers: [
          "+64 (9) 8844133"
      ],
      qrCodeData: "tel:+6498844133"
  }
];


  constructor(
    public dialogRef: MatDialogRef<CallUsComponent>,
    private razaEnvService: RazaEnvironmentService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    ngOnInit() {
      
      // Sort the array based on the specific country_id
        // this.contactDetails.sort((a, b) => {
        //   if (a.country_id === this.data.country) {
        //       return -1; // Place 'a' (specificCountryId) at the beginning
        //   } else if (b.country_id === this.data.country) {
        //       return 1; // Place 'b' (specificCountryId) at the beginning
        //   } else {
        //       return 0; // Preserve the order for other elements
        //   }
        // });
        this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
          this.currentSetting = res;
          this.selectedCountry = res.currentCountryId;

          this.filteredContacts = this.contactDetails.filter(contact => {
            //  return contact.country_id === this.data.country;
              return contact.country_id === this.selectedCountry;
            });

        });

        // this.filteredContacts = this.contactDetails.filter(contact => {
        // //  return contact.country_id === this.data.country;
        //   return contact.country_id === this.selectedCountry;
        // });

        console.log('this.filteredContacts', this.filteredContacts)

    }
  closeIcon(): void {
    this.dialogRef.close();
  }
}
