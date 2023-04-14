import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { RazaEnvironmentService } from './core/services/razaEnvironment.service';
import { CurrentSetting } from './core/models/current-setting';

@Component({
    selector: 'AutocompleteComponent',
    template: ' <input class="input search_google" type="text"  #addresstext style="padding: 12px 20px; border: 1px solid #ccc; width: 400px" >',
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    @ViewChild('addresstext') addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;
    currentSetting$: Subscription;
    currentSetting: CurrentSetting;
    constructor(private razaEnvService: RazaEnvironmentService,) {
    }

    ngOnInit() {
        this.currentSetting$ = this.razaEnvService.getCurrentSetting().subscribe(res => {
            this.currentSetting = res;
          });
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        var country_code = '';
        if(this.currentSetting.country.CountryId == 1)
        {
            country_code = 'US';
        }
        if(this.currentSetting.country.CountryId == 2)
        {
            country_code = 'CA';
        }
        if(this.currentSetting.country.CountryId == 3)
        {
            country_code = 'UK';
        }
        const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement,
            {
                componentRestrictions: { country: country_code },
                types: [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }

}
