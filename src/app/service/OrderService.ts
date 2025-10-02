import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Order, OrderStatus, PageResponse } from '../model/order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  //this is backend api link
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }


  //common api error
  private handleError(err: HttpErrorResponse) {
    // console.error('API Error:', error);
    let errorMessage = 'An unexpected error occurred';
    //ErrorEvent typically occurs for client-side or network-related issues
    if (err.error instanceof ErrorEvent) {
      errorMessage = `Error: ${err.error.message}`;
    } else {
      //this error will occur in backend
      errorMessage = `Error Code: ${err.status}\nMessage: ${err.error?.message || err.message}`;
    }
    //we are returing the error as observable.
    return throwError(() => new Error(errorMessage));
  }

  // REAL backend calls - remove mock data
  getOrders(page: number = 0, size: number = 10): Observable<PageResponse<Order>> {
    const params = new HttpParams()
    //HTTP protocol only understands strings in URLs, hence toSring()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Order>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order)
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order)
      .pipe(catchError(this.handleError));
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOrdersByStatus(status: OrderStatus, page: number = 0, size: number = 10): Observable<PageResponse<Order>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Order>>(`${this.apiUrl}/status`, { params })
      .pipe(catchError(this.handleError));
  }
}