import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { getUrl, ACCESS_TOKEN, USER_NAME } from '../helpers/helpers';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _nameSubject: BehaviorSubject<string> = new BehaviorSubject('');
  private readonly _nameObservable: Observable<string> = this._nameSubject.asObservable();

  constructor(private http: HttpClient) {
    this._nameSubject.next(localStorage.getItem(USER_NAME));
  }

  async signIn(email: string, password: string) {
    const response = await this.http.post<{ accessToken: string, name: string }>(getUrl('auth/signin'), {
      email: email,
      password: password
    }).toPromise();
    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(USER_NAME, response.name);
    this._nameSubject.next(response.name);
  }

  async signOut() {
    localStorage.clear();
  }

  isSignedIn() {
    return localStorage.getItem(ACCESS_TOKEN) ? true : false;;
  }

  signUp(email: string, password: string, name: string) {
    return this.http.post<{ accessToken: string }>(getUrl('auth/signup'), {
      email: email,
      password: password,
      name: name
    });
  }

  getName() {
    return this._nameObservable;
  }
}
