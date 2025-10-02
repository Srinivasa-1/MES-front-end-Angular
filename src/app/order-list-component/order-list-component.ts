import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Order, OrderStatus, PageResponse } from '../model/Order';
import { OrderService } from '../service/OrderService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list-component',
  imports: [MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './order-list-component.html',
  styleUrl: './order-list-component.css'
})
export class OrderListComponent {

  // DEBUG FOCUS: Component state management
  displayedColumns: string[] = ['orderNumber', 'productName', 'quantity', 'customerName', 'status', 'priority', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  
  // Pagination properties
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20, 50];
  
  // Loading state
  isLoading = false;
  
  // ViewChild for Material components
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // DEBUG FOCUS: Async operations and error handling
  loadOrders(): void {
    this.isLoading = true;
    console.log('Loading orders...', { page: this.pageIndex, size: this.pageSize });

    this.orderService.getOrders(this.pageIndex, this.pageSize)
      .subscribe({
        next: (response: PageResponse<Order>) => {
          console.log('Orders loaded successfully:', response);
          this.dataSource.data = response.content;
          this.totalElements = response.totalElements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.showError('Failed to load orders');
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    console.log('Page changed:', event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  openCreateDialog(): void {
    console.log('Opening create order dialog');
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Order created, refreshing list');
        this.loadOrders();
      }
    });
  }

  openEditDialog(order: Order): void {
    console.log('Opening edit dialog for order:', order);
    const dialogRef = this.dialog.open(OrderFormComponent, {
      width: '600px',
      data: { mode: 'edit', order }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Order updated, refreshing list');
        this.loadOrders();
      }
    });
  }

  deleteOrder(order: Order): void {
    console.log('Attempting to delete order:', order);
    
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      this.orderService.deleteOrder(order.id!).subscribe({
        next: () => {
          console.log('Order deleted successfully');
          this.showSuccess('Order deleted successfully');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.showError('Failed to delete order');
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  // DEBUG FOCUS: Utility method for status display
  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.COMPLETED: return 'primary';
      case OrderStatus.IN_PROGRESS: return 'accent';
      case OrderStatus.PENDING: return 'warn';
      case OrderStatus.CANCELLED: return 'warn';
      default: return '';
    }
  }
}
