import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {

    token = '1234567890';

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.token}`
            }
        });
        return next.handle(req);
    }
}
