import { api } from '../services/api';
import { OrderCard } from '../components/OrderCard';
import { Order } from '../types';

export class OrdersPage {
    private container: HTMLElement;
    private orders: Order[] = [];

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async init(): Promise<void> {
        await this.loadOrders();
        this.render();
    }

    private async loadOrders(): Promise<void> {
        const response = await api.getOrders();
        if (response.success && response.data) {
            this.orders = response.data;
        }
    }

    private render(): void {
        if (this.orders.length === 0) {
            this.container.innerHTML = `
                <div class="orders-empty">
                    <h2>No orders yet</h2>
                    <a href="/" class="btn btn-primary" data-link>Start Shopping</a>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="orders-page">
                <h2>My Orders</h2>
                <div class="orders-list" id="orders-list"></div>
            </div>
        `;

        const ordersList = document.getElementById('orders-list');
        if (ordersList) {
            this.orders.forEach(order => {
                const orderCard = new OrderCard(order);
                ordersList.appendChild(orderCard.getElement());
            });
        }
    }

    destroy(): void {
        this.container.innerHTML = '';
    }
}