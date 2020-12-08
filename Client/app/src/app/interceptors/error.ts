import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ModalService } from '../services/modal/modal.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private modalService: ModalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(error => {
            if ([401, 403].includes(error.status)) {
                this.modalService.openModal('Please login and try again.')
            } else {
                this.modalService.openModal('Sorry, server responded with error. Please, try again.')
            }
            return throwError(error);
        }));
    }
}