import { Component } from '@angular/core';
import { Order, OrderStatus, PageResponse } from '../model/order';
import { PageEvent } from '@angular/material/paginator';
import { OrderService } from '../service/OrderService';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { OrderFrom } from '../order-from/order-from';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderList {
  displayedColumns: string[] = ['orderNumber', 'productName', 'quantity', 'customerName', 'status', 'actions'];
  dataSource: Order[] = [];
  
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  isLoading = false;

  constructor(private orderService: OrderService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders(this.pageIndex, this.pageSize).subscribe({
      next: (response: PageResponse<Order>) => {
        this.dataSource = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
        console.log('Orders loaded:', this.dataSource);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }

  deleteOrder(order: Order): void {
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      this.orderService.deleteOrder(order.id!).subscribe({
        next: () => {
          console.log('Order deleted');
          this.loadOrders();
        },
        error: (error) => console.error('Delete error:', error)
      });
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.COMPLETED: return 'primary';
      case OrderStatus.IN_PROGRESS: return 'accent';
      case OrderStatus.PENDING: return 'warn';
      case OrderStatus.CANCELLED: return 'warn';
      default: return '';
    }
  }


// Add this method to OrderListComponent
openCreateDialog(): void {
  const dialogRef = this.dialog.open(OrderFrom, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadOrders();
    }
  });
}


openEditDialog(order: Order): void {
  const dialogRef = this.dialog.open(OrderFrom, {
    width: '500px',
    data: { order: order } // Pass the order to edit
  });

  dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result) {
      this.loadOrders(); // Refresh the list after update
    }
  });
}

}