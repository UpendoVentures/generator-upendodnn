import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from './interfaces/Item';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private baseUrl = 'DesktopModules/Angular1/API/Items/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET heroes from the server */
  getItems(): Observable<Item[]> {
    const url = this.baseUrl + "GetList";
    return this.http.get<Item[]>(url)
      .pipe(
        tap(_ => this.log('fetched items')),
        catchError(this.handleError<Item[]>('getItems', []))
      );
  }

  deleteItem(itemId: number): Observable<Item> {
    const url = this.baseUrl + "Item/Delete?itemId=" + itemId;
    return this.http.delete<Item>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${itemId}`)),
      catchError(this.handleError<Item>('deleteItem'))
    );
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
