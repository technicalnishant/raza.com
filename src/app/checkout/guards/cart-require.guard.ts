import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CheckoutService } from '../services/checkout.service';
//import { isNullOrUndefined } from 'util';
import { ICheckoutModel } from '../models/checkout-model';
import { isNullOrUndefined } from "../../shared/utilities";

@Injectable({
    providedIn: 'root'
})
export class CartRequireGuard implements CanActivate {
    constructor(
        private checkoutService: CheckoutService,
        private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        let cart: ICheckoutModel;
        this.checkoutService.getCurrentCart().subscribe(res => {
            cart = res;
        })

        if (!isNullOrUndefined(cart)) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
