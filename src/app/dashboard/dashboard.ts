import { Component } from '@angular/core';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Order, OrderStatus } from '../model/order';
import { OrderService } from '../service/OrderService';
import { CommonModule } from '@angular/common';
import { MatChip } from "@angular/material/chips";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,
    MatCardModule,
    MatGridListModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule, MatChip],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  stats = {
    totalOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  };

  recentOrders: Order[] = [];
  isLoading = false;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load all orders to calculate stats
    this.orderService.getOrders(0, 1000).subscribe({
      next: (response) => {
        const allOrders = response.content;
        this.calculateStats(allOrders);
        this.recentOrders = allOrders.slice(0, 5); // Get 5 most recent
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  private calculateStats(orders: Order[]): void {
    this.stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === OrderStatus.PENDING).length,
      inProgressOrders: orders.filter(order => order.status === OrderStatus.IN_PROGRESS).length,
      completedOrders: orders.filter(order => order.status === OrderStatus.COMPLETED).length,
      cancelledOrders: orders.filter(order => order.status === OrderStatus.CANCELLED).length
    };
  }

  getCompletionPercentage(): number {
    if (this.stats.totalOrders === 0) return 0;
    return (this.stats.completedOrders / this.stats.totalOrders) * 100;
  }

  refreshDashboard(): void {
    this.loadDashboardData();
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

}
