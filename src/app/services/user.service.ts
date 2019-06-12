import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  isLoggedIn() : boolean {
    return (localStorage.getItem('wt_current_user') !== null);
  }

  // login(username: string, password: string) : Observable<boolean> {
  //   return this.http.post<any>('https://nocodex.com/api/user/authenticate', { username: username, password: password })
  //     .pipe(map(user => {
  //       if (user.valid) {
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //       }
  //       return user.valid;
  //     }));
  // }
  login(username: string, password: string) : any {
    if (username == password) {
      let user = {
        name: 'Óscar',
        surname: 'Piqueras',
        isAdmin: true
      }
      localStorage.setItem('wt_current_user', JSON.stringify(user));
      return user;
    }
    return null;
  }

  getUser() : any {
    return JSON.parse(localStorage.getItem('wt_current_user'));
  }

  logout() {
    localStorage.removeItem('wt_current_user');
  }

}
