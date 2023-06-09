import { LoginResponse } from '../interfaces/login-response.interface';
import { Observable } from 'rxjs';
import { decode } from 'punycode';
import { JwtToken } from './../interfaces';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
//import * as jwtDecode from 'jwt-decode';
//import * as _ from 'lodash';
// import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
//import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { appVariables, validationMessages, userRoleDefaultPages } from '../../app.constants';
import { User } from './../interfaces';


function getWindow(): any {
	return window;
}

@Injectable()
export class HelperService {
	addContentTypeHeader: boolean | string = true;
	tickerInstance: any = null;
	env: string;
	menuAccesses: string;
	resourceActionAccessMap: any;
	constructor() {
		this.env = environment.env;
	}

	// return the global window object
	get nativeWindow(): any {
		return getWindow();
	}

	isProdEnv(): boolean {
		return (this.env.toLocaleLowerCase() === 'prod' ||
			this.env.toLocaleLowerCase() === 'production') ? true : false;
	}
	isStageEnv(): boolean {
		return (this.env.toLocaleLowerCase() === 'stage' ||
			this.env.toLocaleLowerCase() === 'staging') ? true : false;
	}
	isDevEnv(): boolean {
		return (this.env.toLocaleLowerCase() === 'dev' ||
			this.env.toLocaleLowerCase() === 'development') ? true : false;
	}

	/**
	 * Toaster messages
	 *
	 */
	showSuccess(title, message) {
	//	this.toastr.success(title, message);
	}

	showError(title, message) {
		//this.toastr.error(title, message);
	}

	showInfo(title, message) {
	//	this.toastr.info(title, message);
	}

	showWarning(title, message) {
		//this.toastr.warning(title, message);
	}

	/**
	 * Use this method to create logs to the server
	 * Pass info like error stack (if error), user info, user brower and other details
	 */
	serverLogger(log: any) {
		// tslint:disable-next-line:no-console

	}

	secondsTicksCounter(): object {
		let seconds = 0;
		// tslint:disable-next-line:prefer-const
		let interval;
		return {
			start: () => {
				return setInterval(function() {
					seconds++;
				}, 1000);
			},
			stop: (intervalInstance: any) => {
				clearInterval(intervalInstance);
				return seconds;
			},
			intervalInstance: null,
		};
	}


	deleteAllCookies(): void {
		const cookies = document.cookie.split(';');
		for (const cookie of cookies) {
			const eqPos = cookie.indexOf('=');
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		}
	}

	getUserFromLocalStorage(): User {
		const user = localStorage.getItem(appVariables.userLocalStorage);
		return <User>JSON.parse(user);
	}

	getUserRole(): string {
		const user: User = this.getUserFromLocalStorage();
		return (user) ? user.roleNames[0] : null;
	}

	isUserLoggedIn(): boolean {
		const user = localStorage.getItem(appVariables.userLocalStorage);
		return (user && user.length > 0) ? true : false;
	}

	isRegistrationPage(url: string) {
		return url === appVariables.registrationPageUrl ? true : false;
	}

	redirectToLogin() {

	}

	getUserDefaultPageUrl(): string {
		const role: string = this.getUserRole();
		const defaultPage = userRoleDefaultPages[role];
		return defaultPage;
	}

	initFormControls(self: object, formGroup: FormGroup, controlNames: string[]): void {
		for (const controlName of controlNames) {
			self[controlName] = formGroup.controls[controlName];
		}
	}

	getInputValidationClass(formGroup: FormGroup, formControlName: string): string {
		if (formGroup) {
			const formControl: AbstractControl = formGroup.controls[formControlName];
			if (formControl && formControl.touched) {
				return formControl.valid ? appVariables.successInputClass : appVariables.errorInputClass;
			}
		}

		return '';
	}

	getConfirmInputValidationClass(compareFromGroup: FormGroup,
		formControl: AbstractControl, confirmFormControl: AbstractControl, test: FormGroup): string {
		if ((formControl && formControl.touched) || (confirmFormControl && confirmFormControl.touched)) {
			return compareFromGroup.valid ? appVariables.successInputClass : appVariables.errorInputClass;
		}
		if (formControl && formControl.touched) {
			return formControl.valid ? appVariables.successInputClass : appVariables.errorInputClass;
		} else {
			return '';
		}
	}

	showCompareCtrlsValidationMsg(frmGroup: FormGroup, ctrl1: AbstractControl, ctrl2: AbstractControl): boolean {
		return (frmGroup && !frmGroup.valid && (ctrl1.touched || ctrl1.touched)) ? true : false;
	}

	showCtrlValidationMsg(formControl: AbstractControl): boolean {
		return (formControl && !formControl.valid && formControl.touched && formControl.errors) ? true : false;
	}

	getCtrlValidationMsg(formGroup: FormGroup, ctrlName: string): string {
		if (formGroup) {
			const formControl: AbstractControl = formGroup.controls[ctrlName];
			if (formControl && formControl.errors) {
				const errors = formControl.errors;
				if (errors.required) {
					return validationMessages[ctrlName].required;
				} else if (errors.minlength && errors.minlength.requiredLength) {
					return validationMessages[ctrlName].minLength(errors.minlength.requiredLength);
				} else if (errors.maxlength && errors.maxlength.requiredLength) {
					return validationMessages[ctrlName].maxLength(errors.maxlength.requiredLength);
				} else if (errors.digitsOnly && !errors.digitsOnly.valid) {
					return validationMessages[ctrlName].digitsOnly();
				} else if (errors.validateEmail && !errors.validateEmail.valid) {
					return validationMessages[ctrlName].invalid();
				}
			}
		}

		return null;
	}

	getFormGroupCtrlValidationMsg(frmGroup: FormGroup, ctrlName: string): string {
		if (frmGroup && frmGroup.errors) {
			const errors = frmGroup.errors;
			if (errors.equal && !errors.equal.valid) {
				return validationMessages[ctrlName].equal;
			}
		}
	}

	// setResourceAccessesFromJwtTokenLocalStorage() {
	// 	const accessToken: string = localStorage.getItem(appVariables.accessTokenLocalStorage);
	// 	if (!accessToken) {
	// 		return null;
	// 	}
	// 	const decoded: JwtToken = jwtDecode(accessToken.split(' ')[1]);
	// 	const resourcesAccess: any = {};
	// 	let actions: string;
	// 	for (const key in decoded) {
	// 		if (key.indexOf(appVariables.actionSearchKey) !== -1) {
	// 			actions = decoded[key];
	// 			resourcesAccess[key] = actions;
	// 		}
	// 	}
	// 	localStorage.setItem(appVariables.resourceAccessLocalStorage, JSON.stringify(resourcesAccess));
	// }

	// setMenuAccessesFromJwtToken() {
	// 	const accessToken: string = localStorage.getItem(appVariables.accessTokenLocalStorage);
	// 	if (!accessToken) {
	// 		return false;
	// 	}
	// 	const decoded: JwtToken = jwtDecode(accessToken.split(' ')[1]);
	// 	this.menuAccesses = decoded.Menu;
	// }

	createResourceActionAccessMapFromJwtToken() {
		const user: User = <User>JSON.parse(localStorage.getItem(appVariables.userLocalStorage));
		const accessesRaw: any = <any>JSON.parse(localStorage.getItem(appVariables.resourceAccessLocalStorage));
		if (!accessesRaw || !user) {
			return null;
		}
		const accessMap: any[] = [];
		const resourcesAccess = {};
		// tslint:disable-next-line:forin
		for (const key in accessesRaw) {
			const resourceName = key;
			const actions = accessesRaw[key].split(',');
			resourcesAccess[resourceName].actions = [];
			resourcesAccess[resourceName].userId = user.id;
			let name = '';
			let isAllowed = false;
			if (actions.indexOf(appVariables.resourceActions.addActionName) > -1) {
				name = appVariables.resourceActions.addActionName;
				isAllowed = true;
			} else {
				name = appVariables.resourceActions.addActionName;
				isAllowed = false;
			}
			resourcesAccess[resourceName].actions.push({ name, isAllowed });


			if (actions.indexOf(appVariables.resourceActions.deleteActionName) > -1) {
				name = appVariables.resourceActions.deleteActionName;
				isAllowed = true;

			} else {
				name = appVariables.resourceActions.deleteActionName;
				isAllowed = false;
			}
			resourcesAccess[resourceName].actions.push({ name, isAllowed });


			if (actions.indexOf(appVariables.resourceActions.getActionName) > -1) {
				name = appVariables.resourceActions.getActionName;
				isAllowed = true;
			} else {
				name = appVariables.resourceActions.getActionName;
				isAllowed = false;
			}
			resourcesAccess[resourceName].actions.push({ name, isAllowed });


			if (actions.indexOf(appVariables.resourceActions.updateActionName) > -1) {
				name = appVariables.resourceActions.updateActionName;
				isAllowed = true;
			} else {
				name = appVariables.resourceActions.updateActionName;
				isAllowed = false;
			}
			resourcesAccess[resourceName].actions.push({ name, isAllowed });

		}
		return resourcesAccess;
	}

	isAccessToResourceAllowed(resourceName: string): boolean {
		const accessesRaw: any = <any>JSON.parse(localStorage.getItem(appVariables.resourceAccessLocalStorage));
		if (!accessesRaw) {
			return false;
		}
		let actions: string[];
		if (!accessesRaw[resourceName]) {
			return false;
		}
		actions = accessesRaw[resourceName].split(',');
		if (actions.length === 1 && actions[0] === '') {
			actions = [];
		}
		return (!actions || actions.length < 1) ? false : true;
	}

	

	isAccessToActionAllowed(resourceName: string, actionName: string): boolean {
		const accessesRaw: any = <any>JSON.parse(localStorage.getItem(appVariables.resourceAccessLocalStorage));
		const actions: string = accessesRaw[resourceName];

		return (actions && actions.indexOf(actionName) !== -1) ? true : false;
	}

	convertToResourceAccessMap(accessCheckBoxes: any, userId?: string) {
		const resourcesAccess = {};
		for (const key in accessCheckBoxes) {
			if (accessCheckBoxes[key] !== undefined && accessCheckBoxes[key] !== null) {
				const resourceName = key.split('.')[0];
				const actions = key.split('.')[1];
				const isAllowed = accessCheckBoxes[key];
				resourcesAccess[resourceName] = resourcesAccess[resourceName] || {};
				resourcesAccess[resourceName].actions = resourcesAccess[resourceName].actions || [];
				resourcesAccess[resourceName].actions.push({ name: actions, isAllowed });
				resourcesAccess[resourceName].userId = userId || '';
			}
		}
		return resourcesAccess;
	}

	addUserIdToResourceAccessMap(accessMap: any, userId: string) {
		for (const key in accessMap) {
			if (accessMap[key]) {
				accessMap[key]['userId'] = userId;
			}
		}
		return accessMap;
	}

	getUnitNameById(id: number): string {
		for (const unit of appVariables.rateUnits) {
			if (unit.id === id) {
				return unit.name;
			}
		}
		return '';
	}

	startLoader(delay?: number): void {
		// delay = delay || typeof delay === 'number' ? delay : 0;
		// setTimeout(() => {
		// 	this.slimLoadingBarService.start(() => {
		// 		// Loading Completed;
		// 	});
		// }, delay);
	}

	stopLoader(delay?: number): void {
		// delay = delay || typeof delay === 'number' ? delay : 0;
		// setTimeout(() => {
		// 	this.slimLoadingBarService.complete();
		// }, delay);
	}

	getObjectKeys(object: {}): string[] {
		if (!object || typeof object !== 'object') {
			throw new Error('Only objects can be passed to retrieve its own enumerable properties(keys).');
		}
		return Object.keys(object);
	}

	signOutUser() {
		localStorage.clear();
		window.location.href = appVariables.loginPageUrl;
	}

	searchInArray(inputArray, lookUpArray, caseSensitiveSearch): any[] {
		const result: any[] = [];
		outer:
		for (let index = 0; index < inputArray.length; index++) {
			const item = inputArray[index];
			for (let i = 0; i < lookUpArray.length; i++) {
				const lookUpItem = lookUpArray[i];
				if (item[lookUpItem.key] !== lookUpItem.value) {
					continue outer;
				}
			}
			result.push(item);
		}
		return result;
	}

	searchInArrayTest(inputArray: any[], lookUpArray: any[], caseSensitiveSearch?: boolean, exactMatch?: boolean): any[] {
		const result: any[] = [];
		outer:
		for (const item of inputArray) {
			for (const lookUpItem of lookUpArray) {
				const sourceString: string = caseSensitiveSearch ? item[lookUpItem.key].toString() :
					item[lookUpItem.key].toString().toLocaleLowerCase();
				const searchForString: string = caseSensitiveSearch ? lookUpItem.value.toString() :
					lookUpItem.value.toString().toLocaleLowerCase();
				if (exactMatch) {
					if (sourceString === searchForString) {
						continue outer;
					}
				} else {
					if (sourceString.indexOf(searchForString) === -1) {
						continue outer;
					}
				}
			}
			result.push(item);
		}
		return result;
	}

	capitalizeFirstLetter(string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

}
