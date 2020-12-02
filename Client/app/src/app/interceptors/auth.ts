import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModalService } from '../services/modal/modal.service';
import { UsersService } from '../services/users/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private usersService: UsersService, private router: Router, private modalService: ModalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.usersService.isUserLoggedIn) {
            req = this.setAuthHeader(req);
        }

        return next.handle(req).pipe(catchError(error => {
            if ([401, 403].includes(error.status)) {
                this.usersService.logoutUser();
                this.router.navigate(['/login']);
            }
            return throwError(error);
        }));
    }

    private setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`)
        });
    }
}