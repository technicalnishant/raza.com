import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../core/services/api.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SupportService {

    constructor(private httpClient: HttpClient) { }

    sendAppLink(phoneNumber): Observable<boolean> {
        const body = {
            phoneNumber: phoneNumber
        };
        return this.httpClient.post(Api.support.sendAppLink, body).pipe(map(res => {
            return true;
        }));
    }

    getEnvVar() {
        return this.httpClient.get<any>(Api.support.env);
    }
}