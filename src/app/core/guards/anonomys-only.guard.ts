import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class AnonomysOnlyGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private router: Router
    ) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if (!this.authService.isAuthenticated()) {
            return true;
        }

        // already logged in so redirect to my account page
        this.router.navigate(['/account/overview']);
        return false;

    }
}
