import { isDevMode } from '@angular/core';
import { environment } from '../environments/environment';

export class Config {
	static application = {
		name: 'Raza.com',
		description: '',
		mailAddress: '',
		phoneNumber: '',
		companyName: 'Raza Communications.',
		copyright: '',
		address: '',
		social: {
			facebook: {
				address: '',
				name: ''
			},
			twitter: {
				address: '',
				name: ''
			},
			linkedin: {
				address: '',
				name: ''
			},
			googlePlus: {
				address: '',
				name: ''
			},
			instagram: {
				address: '',
				name: ''
			},
			pintrest: {
				address: '',
				name: ''
			},
		}
	};
}
