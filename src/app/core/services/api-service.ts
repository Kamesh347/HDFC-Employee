import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  

  private http =inject(HttpClient);

  // private inject(Environments: any) ;

  //  priavte environment = inject(Environments);

  private baseUrl = Environment.apiUrl;

  // constructor() {
  //   private baseUrl = Environment.apiUrl;
  // }

// get<T>(endpoint: string,param?:HttpParams | {[param: string]: any}) : Observable<ApiResponse<T>> {
//     return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params})
//     .pipe(catchError(this.handleError));
//   }


  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  patch<T>(endpoint: string, data: any) {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  } 

  
  // }

}
