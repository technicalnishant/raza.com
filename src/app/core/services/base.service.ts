// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Rx';
// import { Router } from '@angular/router';
// import { ServerResponse, Error } from '../interfaces';
// import { appVariables } from '../../app.constants';
// import { HttpClient, HttpHeaders, HttpRequest, HttpParams, HttpResponse } from '@angular/common/http';
// import { CustomErrorHandlerService } from './custom-error-handler.service';
// import { Api } from './api.constants';
// import { HelperService } from './helper.service';
// import { AuthenticationService } from './auth.service';

// @Injectable()
// export class BaseService {
// 	constructor(
// 		private router: Router,
// 		private httpClient: HttpClient,
// 		private authService: AuthenticationService,
// 		private errorHandler: CustomErrorHandlerService,
// 		private helperService: HelperService,
	
// 	 ) {
// 	}

// 	private createAuthorizationHeader(headers: HttpHeaders) {
// 		const accessToken = this.authService.getAccessToken();
// 		if (accessToken != null) {
// 			headers = headers.append('Authorization', 'Bearer ' + accessToken);
// 		}

// 		if (headers.get('Access-Control-Allow-Origin') == null) {
// 			headers = headers.append('Access-Control-Allow-Origin', Api.angularApplicationAddress);
// 		}
// 		return headers;
// 	}

// 	get(url, headers?: HttpHeaders) {
// 		this.helperService.startLoader();
// 		headers = headers || new HttpHeaders();
// 		headers = this.createAuthorizationHeader(headers);

// 		return this.httpClient.get(url, { headers: headers }).map((res: HttpResponse<any>) => {
// 			return this.handleResponse(res);
// 		}).catch((error) => Observable.throw(this.handleError(error)))
// 			.finally(() => {
// 				this.helperService.stopLoader();
// 			});
// 	}


// 	post(url, postBody: any, headers?: HttpHeaders) {
// 		this.helperService.startLoader();
// 		headers = headers || new HttpHeaders();
// 		headers = this.createAuthorizationHeader(headers);
// 		headers = headers.append('Content-Type', 'application/json');
// 		return this.httpClient.post(url, postBody, { headers: headers })
// 			.map((res: HttpResponse<any>) => {
// 				return this.handleResponse(res);
// 			})
// 			.catch((error) => Observable.throw(this.handleError(error)))
// 			.finally(() => {
// 				this.helperService.stopLoader();
// 			});

// 	}
// 	delete(url, id: any, headers?: HttpHeaders) {
// 		this.helperService.startLoader();
// 		headers = headers || new HttpHeaders();
// 		headers = this.createAuthorizationHeader(headers);
// 		url = url + "/" + id;
// 		return this.httpClient.delete(url, { headers: headers }).map((res: HttpResponse<any>) => {
// 			return this.handleResponse(res);
// 		}).catch((error) => Observable.throw(this.handleError(error)))
// 			.finally(() => {
// 				this.helperService.stopLoader();
// 			});
// 	}
// 	put(url, putData, headers?: HttpHeaders) {
// 		this.helperService.startLoader();
// 		headers = headers || new HttpHeaders();
// 		headers = this.createAuthorizationHeader(headers);
// 		headers = headers.append('Content-Type', 'application/json');
// 		return this.httpClient.put(url, putData, { headers: headers }).map((res: HttpResponse<any>) => {
// 			return this.handleResponse(res);
// 		}).catch((error) => Observable.throw(this.handleError(error)))
// 			.finally(() => {
// 				this.helperService.stopLoader();
// 			});
// 	}

// 	formUrlParam(url, data) {
// 		let queryString = '';
// 		for (const key in data) {
// 			if (data.hasOwnProperty(key)) {
// 				if (!queryString) {
// 					queryString = `?${key}=${data[key]}`;
// 				} else {
// 					queryString += `&${key}=${data[key]}`;
// 				}
// 			}
// 		}
// 		return url + queryString;
// 	}

// 	handleError(error) {
// 		if (error.status === 401 || error.status === 403) {
// 			// if not authenticated try login with refresh token, if that does not work,
// 			// clear the local storage and redirect to login page

// 			this.authService.logout();
// 			this.router.navigate(['/login']);
// 		}
// 		console.log('GOT ERROR');
// 		console.log(error);
// 		this.showToast("API Error", error.message);
// 		return this.errorHandler.tryParseError(error);
// 	}

// 	handleResponse(response) {
// 		if (response !== null && response.error !== undefined) {
// 			const error: Error = { error: response.error, message: response.message };
// 			// throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
// 			this.showToast("API Error", response.message);
// 			throw new Error(this.handleError(error));
// 		} else {
// 			return response;
// 		}
// 	}

// 	refreshToken(res: Response) {
// 		const token = res.headers.get(appVariables.accessTokenServer);
// 		if (token) {
// 			localStorage.setItem(appVariables.accessTokenLocalStorage, `${token}`);
// 		}
// 	}

// 	showToast(title, body): void {
// 		if (!this.helperService.isProdEnv) {
// 			this.helperService.showError(title, body);
// 		}
// 		// this.snotify.toastConfig.title = title;
// 		// this.snotify.toastConfig.body = body;
// 		// this.snotify.toastConfig.bodyMaxLength = 100;
// 		// this.snotify.onError();
// 	}
// }
