import { environment } from '../environments/environment';
import { Config } from './app.config';

export const roleNames = {
	superAdmin: 'SuperAdmin',
	admin: 'Admin',
	manager: 'Manager',
	client: 'Client',
};

export const userRoleDefaultPages = {
	SuperAdmin: 'pages/admin/manage',
	Admin: 'pages/admin/dashboard',
	Manager: 'pages/manager/dashboard',
	Client: 'pages/client',
};

function createUrl(actionName: string): string {
	return `${environment.apiHost}${actionName}`;
}
function createAuthUrl(actionName: string): string {
	return `${environment.apiHost}${actionName}`;
}

export const appVariables = {
	userLocalStorage: 'user',
	resourceAccessLocalStorage: 'resourceAccessRaw',
	accessTokenServer: 'X-Auth-Token',
	defaultContentTypeHeader: 'application/json',
	loginPageUrl: '/login',
    registrationPageUrl: '/register',
    accessTokenLocalStorage: 'accessToken',
    errorInputClass: 'has-error',
    successInputClass: 'has-success',
    actionSearchKey: 'Entity',
    resourceActions: {
		getActionName: 'Read',
		addActionName: 'Create',
		updateActionName: 'Update',
		deleteActionName: 'Delete',
	},
	rateUnits: [
		{ id: 1, name: 'Hourly' },
		{ id: 2, name: 'Monthly' },
		{ id: 3, name: 'Annually' },
	]
};

export const validationMessages = {
    
}