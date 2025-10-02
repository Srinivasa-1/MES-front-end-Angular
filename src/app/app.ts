import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OrderList } from './order-list/order-list';

@Component({
  selector: 'app-root',
  imports: [CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    OrderList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'mes';
  
}