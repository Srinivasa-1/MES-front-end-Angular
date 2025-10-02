import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { Order, OrderStatus, PageResponse } from "../model/Order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) { }

  // DEBUG FOCUS: Error handling and request logging
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  createOrder(order: Order): Observable<Order> {
    console.log('Creating order:', order);
    return this.http.post<Order>(this.apiUrl, order)
      .pipe(
        tap(createdOrder => console.log('Order created successfully:', createdOrder)),
        catchError(this.handleError)
      );
  }

  // DEBUG FOCUS: HttpParams for query parameters
  getOrders(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PageResponse<Order>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    console.log('Fetching orders with params:', params.toString());
    
    return this.http.get<PageResponse<Order>>(this.apiUrl, { params })
      .pipe(
        tap(response => console.log(`Retrieved ${response.content.length} of ${response.totalElements} orders`)),
        catchError(this.handleError)
      );
  }

  getOrderById(id: number): Observable<Order> {
    console.log(`Fetching order with ID: ${id}`);
    return this.http.get<Order>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(order => console.log('Order retrieved:', order)),
        catchError(this.handleError)
      );
  }

  updateOrder(id: number, order: Order): Observable<Order> {
    console.log(`Updating order ${id}:`, order);
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order)
      .pipe(
        tap(updatedOrder => console.log('Order updated:', updatedOrder)),
        catchError(this.handleError)
      );
  }

  deleteOrder(id: number): Observable<void> {
    console.log(`Deleting order with ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => console.log(`Order ${id} deleted successfully`)),
        catchError(this.handleError)
      );
  }

  getOrdersByStatus(status: OrderStatus, page: number = 0, size: number = 10): Observable<PageResponse<Order>> {
    let params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());

    console.log(`Fetching ${status} orders with params:`, params.toString());
    
    return this.http.get<PageResponse<Order>>(`${this.apiUrl}/status`, { params })
      .pipe(
        tap(response => console.log(`Retrieved ${response.content.length} ${status} orders`)),
        catchError(this.handleError)
      );
  }
}