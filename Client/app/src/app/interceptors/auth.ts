import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Endpoints } from '../endpoints';
import { UsersService } from '../services/users/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private usersService: UsersService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes(Endpoints.Register)
            || req.url.includes(Endpoints.Login)
            || !this.usersService.isUserLoggedIn) {
            return next.handle(req);
        } else if (this.usersService.isJwtExpired && this.usersService.isUserLoggedIn) {
            this.usersService.refreshJwt()
            return next.handle(this.setAuthHeader(req));
        }
        return next.handle(req);
    }

    private setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
        return req.clone({
            headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`)
        });
    }
}