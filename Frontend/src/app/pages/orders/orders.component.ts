import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public orderService = inject(OrderService);
  public showSuccessMessage = signal<boolean>(false);
  public expandedOrders = signal<Set<number>>(new Set());

  ngOnInit(): void {
    // Fetch the user's orders automatically when the component mounts
    this.orderService.loadOrders();

    // Check router state to display the success message
    if (typeof window !== 'undefined' && history.state?.orderPlaced) {
      this.showSuccessMessage.set(true);
      // Auto-hide the success message after 5 seconds
      setTimeout(() => this.showSuccessMessage.set(false), 5000);
    }
  }

  toggleOrder(orderId: number) {
    this.expandedOrders.update(current => {
      const newSet = new Set(current);
      if (newSet.has(orderId)) newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  }
}