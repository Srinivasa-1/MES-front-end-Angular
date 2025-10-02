import { Component } from '@angular/core';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { Order} from '../model/order';
import { OrderService } from '../service/OrderService';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reports',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  MatChipsModule,
MatIconModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports {

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = false;
  
  // Filter values
  selectedStatus: string = '';
  selectedPriority: string = '';
  
  displayedColumns: string[] = ['orderNumber', 'productName', 'quantity', 'customerName', 'status', 'priority', 'createdAt'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders(0, 1000).subscribe({
      next: (response) => {
        this.orders = response.content;
        this.filteredOrders = this.orders;
        this.isLoading = false;
        console.log('Loaded orders:', this.orders.length);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters - Status:', this.selectedStatus, 'Priority:', this.selectedPriority);
    
    this.filteredOrders = this.orders.filter(order => {
      // Status filter
      if (this.selectedStatus && order.status !== this.selectedStatus) {
        return false;
      }
      
      // Priority filter
      if (this.selectedPriority && order.priority !== this.selectedPriority) {
        return false;
      }
      
      return true;
    });
    
    console.log('Filtered to:', this.filteredOrders.length, 'orders');
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.selectedPriority = '';
    this.filteredOrders = [...this.orders];
    console.log('Filters reset');
  }

  exportToCSV(): void {
    if (this.filteredOrders.length === 0) return;
    
    const headers = ['Order Number', 'Product Name', 'Quantity', 'Customer Name', 'Status', 'Priority', 'Created Date'];
    const csvData = this.filteredOrders.map(order => [
      order.orderNumber,
      order.productName,
      order.quantity,
      order.customerName,
      order.status,
      order.priority,
      new Date(order.createdAt!).toLocaleDateString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
