import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FaqModel } from '../model/faq-model';

@Injectable({
    providedIn: "root"
})
export class FaqsService {
    constructor(private http: HttpClient) { }

    get(promotionCode: string) {
        return this.http.get<FaqModel[]>(`./assets/faqs/${promotionCode}.json`);
    }
}