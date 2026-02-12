import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getOptions(headers?: HttpHeaders, params?: HttpParams) {
    return {
      headers: headers || new HttpHeaders({ 'Content-Type': 'application/json' }),
      params
    };
  }

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, this.getOptions(undefined, params))
      .pipe(catchError(this.handleError));
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${path}`, body, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
