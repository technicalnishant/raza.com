import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Promotion } from '../model/Promotion';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../core/services/api.constants';


@Injectable({
    providedIn: 'root'
})
export class PromotionsService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getPromotion(countryId, promotionCode): Observable<Promotion> {
        return this.httpClient.get<Promotion>(`${Api.Promotions.get}/${promotionCode}/${countryId}`);
    }
    
    getActivePromotions(countryId: number): Observable<Promotion[]> {
        return this.httpClient.get<Promotion[]>(`${Api.Promotions.get}/${countryId}`);
    }
}