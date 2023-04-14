import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SearchRatesService } from '../../rates/searchrates.service';
import { Country } from '../../shared/model/country';
import { BecomeapartnerService } from '../becomeapartner.service';
import { ApiErrorResponse } from '../../core/models/ApiErrorResponse';
import { RazaSnackBarService } from '../../shared/razaSnackbar.service';
import { MetaTagsService } from 'app/core/services/meta.service';


@Component({
  selector: 'app-becomeapartner',
  templateUrl: './becomeapartner.component.html',
  styleUrls: ['./becomeapartner.component.scss']
})
export class BecomeapartnerComponent implements OnInit {
  becomeAPartnerForm: FormGroup;
  mode = new FormControl('over');
  headerValue: number = 1;
  allCountry: Country[]=[];
  submitted = false;

  constructor(private router: Router, private titleService: Title,
    private companyService: BecomeapartnerService, public snackbar: RazaSnackBarService,
    private searchRatesService: SearchRatesService, private formBuilder: FormBuilder,
    private metaTagsService:MetaTagsService,) {
    this.searchRatesService.getAllCountries().subscribe(
      (data: Country[]) => {
        this.allCountry = data.filter(c=> c.CountryName=="Canada" || c.CountryName=="USA");
      },
      (err: ApiErrorResponse) => console.log(err),
    );
  }

  ngOnInit() {
    //this.titleService.setTitle('Become a partner');
    this.createBecomePartnerForm();
    this.metaTagsService.getMetaTagsData('becomeapartner');
  }

  createBecomePartnerForm() {
    this.becomeAPartnerForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
      city: new FormControl('', Validators.required),
      countrySelect: new FormControl('', [Validators.required, Validators.nullValidator]),
      comments: new FormControl('', Validators.required)
    });
  }

  onBecomeAPartnerFormSubmit(formData: any, formDirective: FormGroupDirective): void {
    this.submitted = true;
    if (this.becomeAPartnerForm.invalid) {
      return;
    }

    var becomeAPartner = {
      FirstName: this.becomeAPartnerForm.get('firstName').value,
      LastName: this.becomeAPartnerForm.get('lastName').value,
      Email: this.becomeAPartnerForm.get('email').value,
      PhoneNumber: this.becomeAPartnerForm.get('phoneNumber').value,
      City: this.becomeAPartnerForm.get('city').value,
      Country: this.becomeAPartnerForm.get('countrySelect').value,
      Comment: this.becomeAPartnerForm.get('comments').value
    };

    this.companyService.postBecomeAPartner(becomeAPartner).subscribe(
      (response) => {
        this.snackbar.openSuccess("Your request has been submitted successfully. A Raza Representative will contact you shortly or within 24 hours");
      },
      (err: ApiErrorResponse) => console.log(err),
      () => {
      }
    );
    //Reset form
    formDirective.resetForm();
    this.becomeAPartnerForm.reset();

  }

}
