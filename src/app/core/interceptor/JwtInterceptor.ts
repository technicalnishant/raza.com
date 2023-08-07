import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import { switchMap, filter, take, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoginpopupComponent } from '../loginpopup/loginpopup.component';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private authservice: AuthenticationService,
        public matDialog: MatDialog,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {

        // add authorization header with jwt token if available
        let currentUser = this.authservice.getCurrentLoginUser();
        if (currentUser && currentUser.accessToken) {
            request = this.addToken(request, currentUser.accessToken);
        }

        request.headers.append('Access-Control-Allow-Origin', '*');
        
        
        return next.handle(request).pipe(catchError(error => {
            console.log( error );
           // if (error instanceof HttpErrorResponse && error.status === 401) {
           if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403) ) {
             
              
            this.authservice.logout();
            this.openModal();
               
            } else {
                return throwError(error);
            }
        }));

    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    openModal() {
        const dialogConfig = new MatDialogConfig();
        // The user can't close the dialog by clicking outside its body
        dialogConfig.disableClose = true;
        dialogConfig.id = "modal-component";
        dialogConfig.height = "350px";
        dialogConfig.width = "600px";
        dialogConfig.data = {
          name: "logout",
          title: "Are you sure you want to logout?",
          description: "Pretend this is a convincing argument on why you shouldn't logout :)",
          actionButtonText: "Logout",
        }
        
        const modalDialog = this.matDialog.open(LoginpopupComponent, dialogConfig);
        this.router.navigate(['/']);
      }
    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            
            return this.authservice.refreshLogin().pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.jwt);
                     
                    return next.handle(this.addToken(request, token.jwt));
                    
                })).catch((err: any) => {
                    this.isRefreshing = false;
                    this.authservice.logout();
                    
                    this.router.navigate(['/'])
                    return throwError(err);
                });;

        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    
                    return next.handle(this.addToken(request, jwt));
                }));
        }
    }
}