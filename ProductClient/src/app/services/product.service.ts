import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Product } from '../models/product';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class ProductService {

  private productsUrl = 'http://localhost:5000/api/products';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET products from the server */
  getProducts(productName: string): Observable<Product[]> {
    
    var productFilter = productName && productName != '' ? '?productFilter=' : '';

    return this.http.get<Product[]>(this.productsUrl+productFilter)
      .pipe(
        tap(_ => this.log('fetched products')),
        catchError(this.handleError<Product[]>('getProducts', []))
      );
  }

  /** GET product by sku. Return `undefined` when id not found */
  getProductNo404<Data>(sku: number): Observable<Product> {
    const url = `${this.productsUrl}/?id=${sku}`;
    return this.http.get<Product[]>(url)
      .pipe(
        map(products => products[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
            this.log(`${outcome} product sku=${sku}`);
        }),
          catchError(this.handleError<Product>(`getProduct sku=${sku}`))
      );
  }

  /** GET product by sku. Will 404 if id not found */
  getProduct(sku: number): Observable<Product> {
    const url = `${this.productsUrl}/${sku}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => this.log(`fetched product id=${sku}`)),
      catchError(this.handleError<Product>(`getProduct id=${sku}`))
    );
  }

  /* GET products whose name contains search term */
  searchProducts(term: string): Observable<Product[]> {
    if (!term.trim()) {
      // if not search term, return empty product array.
      return of([]);
    }
    return this.http.get<Product[]>(`${this.productsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found products matching "${term}"`) :
         this.log(`no products matching "${term}"`)),
      catchError(this.handleError<Product[]>('searchProducts', []))
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

  /** Log a ProductService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ProductService: ${message}`);
  }
}
