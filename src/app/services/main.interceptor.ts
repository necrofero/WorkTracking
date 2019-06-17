import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class MainInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
        withCredentials: true 
    });
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {}, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403) {
          console.log('Broken session.');
          this.userService.logout();
          this.router.navigate(['login']);
        }
      }
    }));
  }

}
