import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private http: HttpClient) {}


  login(emailOrEmpId: string, password: string, rememberMe: boolean): Observable<any> {
    // Implementation for login API call

    return this.http.post('/api/login',{emailOrEmpId, password, rememberMe});
  }
}
