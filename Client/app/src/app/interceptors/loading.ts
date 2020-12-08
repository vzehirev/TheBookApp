import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from '../services/loading/loading,service';

@Injectable()
export class LoadingSpinnerInterceptor implements HttpInterceptor {

  constructor(private loadingSpinnerService: LoadingSpinnerService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingSpinnerService.show();

    return next.handle(request).pipe(
      finalize(() => this.loadingSpinnerService.hide())
    );
  }
}