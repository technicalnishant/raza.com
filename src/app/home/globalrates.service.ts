import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Api } from '../core/services/api.constants';
import { catchError, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
//import { ErrorObservable } from 'rxjs/Observable/ErrorObservable';
import { RazaEnvironmentService } from '../core/services/razaEnvironment.service';
import { Country } from '../shared/model/country';
import { ApiErrorResponse } from '../core/models/ApiErrorResponse';
import { AuthenticationService } from 'app/core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class GlobalRatesService {
        constructor(private httpClient: HttpClient, private razaEnvService: RazaEnvironmentService, private authService: AuthenticationService,) { }

        public getAllCountries(): Observable<Country[] | ApiErrorResponse> {
                return this.httpClient.get<Country[]>(`${Api.countries.getAllCountries}`)
                        .pipe(
                                catchError(err => this.handleHttpError(err))
                        );
        }

        public getAllCountriesRates(countryFrom: number): Observable<any[] | ApiErrorResponse> {
                let api_type = 'old';
        //        if(this.authService.isAuthenticated())
        //          api_type = 'old';
        //         return this.httpClient.get<any[]>(`${Api.countries.getCallDetails}` + "/" + countryFrom+"/"+api_type)
        //                 .pipe(
        //                         catchError(err => this.handleHttpError(err))
        //                 );
                return this.httpClient.get<any[]>(`${Api.countries.getCallDetailsOld}` + "/" + countryFrom)
                .pipe(
                        catchError(err => this.handleHttpError(err))
                );

        // var file = 'countries_usa.json';
        // if(countryFrom == 2)
        // file = 'countries_cad.json';
        // if(countryFrom == 3)
        // file = 'countries_uk.json';
        // if(countryFrom == 8)
        // file = 'countries_aus.json';
        // if(countryFrom == 20)
        // file = 'countries_nz.json';
        // if(countryFrom == 26)
        // file = 'countries_in.json';
        // console.log(file);
        // return  this.httpClient.get<[]>("./assets/"+file) ;

        }

        handleHttpError(err: HttpErrorResponse): Observable<ApiErrorResponse> {
                let errorResposne = new ApiErrorResponse();
                errorResposne.errorNumber = err.status;
                errorResposne.message = err.statusText;
                errorResposne.friendlyMessage = "An Error Occurred when retrieving data"

                return throwError(errorResposne);
        }

        public fileExists(url: string): Observable<any> {
                return this.httpClient.get(url)
                    .pipe(
                        map(response => {
                                console.log("status true image found");
                                return true;
                                }),
                        catchError(error => {
                               
                            return of(false);
                        })
                    );
            }


            getImageDimension(image): Observable<any> {
                return new Observable(observer => {
                    const img = new Image();
                    img.onload = function (event) {
                        const loadedImage: any = event.currentTarget;
                        image.width = loadedImage.width;
                        image.height = loadedImage.height;
                        observer.next(image);
                        observer.complete();
                    }
                    img.src = image.url;
                });
            }
}