import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../interfaces/Item';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { NewItem } from '../interfaces/NewItem';


@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private baseUrl = '/DesktopModules/<%= moduleName %>/API/Item/';  // URL to web api
  
  constructor(private http: HttpClient) {}

  /** GET Items from the server */
  getItems(): Observable<Item[]> {
    const url = this.baseUrl + "GetList";
    return this.http.get<Item[]>(url);
  }

   /** Create a new Item */
   createItem(item:NewItem): Observable<any> {
     const url = this.baseUrl + "Save";
     return this.http.post<any>(url, item);
   }

   /** Delete an Item */
  deleteItem(itemId: number): Observable<Item> {
    const url = this.baseUrl + "Delete?itemId=" + itemId;
    return this.http.delete<Item>(url).pipe(
      tap(_ => this.log(`deleted item id=${itemId}`)),
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
