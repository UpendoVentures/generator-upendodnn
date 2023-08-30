import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Setting } from '../interfaces/Setting';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private baseUrl = 'DesktopModules/<%= friendlyName %>/API/Settings/';  // URL to web api
  
  constructor(private http: HttpClient) {}

  /** GET Settings from the server */
  getSettings(): Observable<Setting> {
    const url = this.baseUrl + "LoadSettings";
    return this.http.get<Setting>(url);
  }


  /**
     * Handle Http operation that failed.
     * Let the app continue.
     *
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
    console.log(message);
  }
}
