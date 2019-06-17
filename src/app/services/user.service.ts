import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private configService: ConfigService) { }

  isLoggedIn() : boolean {
    return (localStorage.getItem('wt_current_user') !== null);
  }

  login(username: string, password: string) : Observable<boolean> {
    return this.http.post<any>(`${this.configService.getEndPoint()}/user/authenticate`, { username: username, password: password })
      .pipe(map(user => {
        if (user.id !== '') {
          localStorage.setItem('wt_current_user', JSON.stringify(user));
          return true;
        }
        return false;
      }));
  }

  getUser() : any {
    return JSON.parse(localStorage.getItem('wt_current_user'));
  }

  logout() {
    localStorage.removeItem('wt_current_user');
  }

}
