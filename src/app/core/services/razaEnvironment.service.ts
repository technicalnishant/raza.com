import { Injectable } from "@angular/core";
import { CodeValuePair } from "../models/codeValuePair.model";
import { Observable, of } from "rxjs";
import { CurrentSetting } from "../models/current-setting";
import { Country } from "../models/country.model";
import { HttpClient } from "@angular/common/http";
import { Api } from "./api.constants";
import { isNullOrUndefined } from "../../shared/utilities";
import { catchError, tap } from "rxjs/operators";
 
@Injectable()
export class RazaEnvironmentService {
    
    constructor( 
        private http: HttpClient, 
    ) { }
    // public static EnvCountryId: number = 1;
    // public static EnvCurrency: Currency = Currency.USD;
    private static _setting: CurrentSetting;
    
    // private static _currentSetting = new BehaviorSubject<CurrentSetting>(null)


    getToFixedTrunc(x:any) 
    {
        let n = 2;
        const v = (typeof x === 'string' ? x : x.toString()).split('.');
        if (n <= 0) return v[0];
        let f = v[1] || '';
        if (f.length > n) return `${v[0]}.${f.substr(0,n)}`;
        while (f.length < n) f += '0';
        return `${v[0]}.${f}`
    }

    getCurrentSetting() {
        //return RazaEnvironmentService._currentSetting;
       

        if( localStorage.getItem('session_key') && localStorage.getItem('session_key') !='' && typeof localStorage.getItem('session_key') !== 'undefined')
            {
                const sessionKey : CurrentSetting = new CurrentSetting();
                var sess_key        = JSON.parse(localStorage.getItem('session_key'));
                var sCountryId      = sess_key.country.CountryId;
                var sCountryName    = sess_key.country.CountryName;
                var sCountryCode    = sess_key.country.CountryCode;
                const array_session = {CountryId: sCountryId, CountryName: sCountryName, CountryCode: sCountryCode}
                 
                sessionKey.country = array_session;
                RazaEnvironmentService._setting = sessionKey;
                
               
                return of(sessionKey);
                    
            }
            else
            {
                return of(RazaEnvironmentService._setting);
            }
    }
    getSubCurrencySymbol()
    {
        var echange_rate = JSON.parse(localStorage.getItem('exchangeRate'));
       
        return echange_rate.SubCurrencySymbol;
    }
    getCurrencySymbol()
    {
        var echange_rate = JSON.parse(localStorage.getItem('exchangeRate'));
        return echange_rate.CurrencySymbol;
    }

    
    getFormatedPrice(price:number)
    {
        this.getCurrentSetting().subscribe(a => {
            if(a.country.CountryId >3 )
            {
                var echange_rate = JSON.parse(localStorage.getItem('exchangeRate'));
                
                return this.getToFixedTrunc( price * echange_rate.ExchangeRate);
            }
            else
            {
                
                return of(price);
            }
      }); ;
       
    }
    getXChageRateInfo(countryFromId)
    {
    // return this.http.get(`${Api.rates.getXChageRateInfo}${countryFromId}`)
        let endpoint = 'country_'+countryFromId;
        const cachedData = sessionStorage.getItem(endpoint);

    if (cachedData) {
      return of(JSON.parse(cachedData));
    }
    
     return this.http.get(`${Api.rates.getXChageRateInfo}${countryFromId}`).pipe(
        tap(data => {
          sessionStorage.setItem(endpoint, JSON.stringify(data));
        }),
        catchError(error => {
          console.error('Error fetching data:', error);
          return of(null);
        })
      );


    // return null
    }

    setCurrentSetting(setting: CurrentSetting) {
        if (!isNullOrUndefined(setting) && !isNullOrUndefined(setting.country)) {
            RazaEnvironmentService._setting = setting;
              console.log(setting.country)
              if(setting.country.CountryId > 0)
                {   
                    this.getXChageRateInfo(setting.country.CountryId).subscribe((data:any)=>{
            
                        localStorage.setItem('currencySymbol', data.CurrencySymbol);
                        localStorage.setItem('subCurrencySymbol', data.SubCurrencySymbol);
                        localStorage.setItem('rate', data.ExchangeRate);

                        localStorage.setItem('exchangeRate', JSON.stringify(data));   
                    })
                }
            localStorage.setItem('session_key', JSON.stringify(setting));
             
        }

        window.location.reload;
    }

    getCurrentCurrencySymbol() {

    }

    getMonths(): CodeValuePair[] {
        let months: CodeValuePair[] = [
            new CodeValuePair('01', '01'),
            new CodeValuePair('02', '02'),
            new CodeValuePair('03', '03'),
            new CodeValuePair('04', '04'),
            new CodeValuePair('05', '05'),
            new CodeValuePair('06', '06'),
            new CodeValuePair('07', '07'),
            new CodeValuePair('08', '08'),
            new CodeValuePair('09', '09'),
            new CodeValuePair('10', '10'),
            new CodeValuePair('11', '11'),
            new CodeValuePair('12', '12'),
        ]

        return months;
    }

    getYears(): CodeValuePair[] {
        let years: CodeValuePair[] = [];
        let year: number = new Date().getFullYear();
        for (let index = 0; index < 11; index++) {
            years.push(new CodeValuePair((year - 2000 + index).toString(), (year + index).toString()));
        }
        return years;
    }

    getCurrentLocation(lat: number, lng: number): Observable<Country> {
        const body = {
            Latitude: lat,
            Longitude: lng
        }

        if( localStorage.getItem('session_key') && localStorage.getItem('session_key') !='' && typeof localStorage.getItem('session_key') !== 'undefined')
                    {
                        const sessionKey : CurrentSetting = new CurrentSetting();
                        var sess_key = JSON.parse(localStorage.getItem('session_key'));
                        var sCountryId = sess_key.country.CountryId;
                        var sCountryName = sess_key.country.CountryName;
                        var sCountryCode = sess_key.country.CountryCode;

                        
                         const array_session = {CountryId: sCountryId, CountryName: sCountryName, CountryCode: sCountryCode};
                        //console.log(array_session);
                        //sessionKey.country = array_session;
                        //RazaEnvironmentService._setting = sessionKey;
                        return of(array_session);
                        
                        
                    }
                    else
                    {
                        return this.http.post<Country>(Api.auth.geoCountry, body);
                    }
                    

        
    }
	
	
	
	 getCurrentLocationWithIp(lat: number, lng: number): Observable<Country> {
        const body = {
            Latitude: lat,
            Longitude: lng
        }

        if( localStorage.getItem('session_key') && localStorage.getItem('session_key') !='' && typeof localStorage.getItem('session_key') !== 'undefined')
                    {
                        const sessionKey : CurrentSetting = new CurrentSetting();
                        var sess_key = JSON.parse(localStorage.getItem('session_key'));
                        var sCountryId = sess_key.country.CountryId;
                        var sCountryName = sess_key.country.CountryName;
                        var sCountryCode = sess_key.country.CountryCode;

                        
                         const array_session = {CountryId: sCountryId, CountryName: sCountryName, CountryCode: sCountryCode};
                        //console.log(array_session);
                        //sessionKey.country = array_session;
                       // RazaEnvironmentService._setting = sessionKey;
                        
                        return of(array_session);
                        
                        
                    }
                    else
                    {
                        return this.http.post<Country>(`${Api.auth.geoCountry}/default`, body);
                    }
                    

        
    }
	
	
 getIPAddress()
  {
  var ipadd = '';
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      ipadd = res.ip;
    });
  }
    getCurrentLocationByIp(): Promise<Object> {
       var curent_url = window.location.href;
	    
	   if(curent_url.indexOf('mobile_pay') === -1)
	   { }
	   console.log("URL call blockd");
            return new Promise((resolve, reject) => {

                
                    if( localStorage.getItem('session_key') && localStorage.getItem('session_key') !='' && typeof localStorage.getItem('session_key') !== 'undefined')
                    {
                        const sessionKey : CurrentSetting = new CurrentSetting();
                        var sess_key = JSON.parse(localStorage.getItem('session_key'));
                        var sCountryId = sess_key.country.CountryId;
                        var sCountryName = sess_key.country.CountryName;
                        var sCountryCode = sess_key.country.CountryCode;

                        
                        const array_session = {CountryId: sCountryId, CountryName: sCountryName, CountryCode: sCountryCode}
                       // console.log(array_session);
                        sessionKey.country = array_session;
                        RazaEnvironmentService._setting = sessionKey;
                        resolve(array_session);
                    }
                    else
                    {
                        this.http.get<Country>(`${Api.auth.geoCountry}/default`).subscribe(res => {
                            const setting: CurrentSetting = new CurrentSetting();
                            setting.country = res;
                            RazaEnvironmentService._setting = setting;
                             
                           this.setCurrentSetting(setting)

                            resolve(res);
                         })
                    }
                    
                
            });
         
       
    }

}


@Injectable()
export class LocationService {
    constructor(
        private http: HttpClient
    ) { }

    getCurrentLocationByIp(): Promise<Object> {
        return new Promise((resolve, reject) => {
            const c: Country = {
                CountryCode: '1',
                CountryId: 1,
                CountryName: 'USA'
            };

            resolve(c);
            // this.http.get<Country>(`${Api.auth.geoCountry}/default`).subscribe(res => {
            //     resolve(res);
            // })
        });

    }
}

