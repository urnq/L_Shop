import { Order } from '../types';

export class OrderCard {
    private element: HTMLElement;
    private order: Order;

    constructor(order: Order) {
        this.order = order;
        this.element = this.render();
    }

    private render(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'order-card';
        div.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${this.order.id.slice(0, 8)}</span>
                <span class="order-date">${new Date(this.order.createdAt).toLocaleDateString()}</span>
                <span class="order-status status-${this.order.status}">${this.order.status}</span>
            </div>
            <div class="order-items">
                ${this.order.items.map(item => `
                    <div class="order-item">
                        <span>${item.product?.title} x ${item.quantity}</span>
                        <span>$${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <span>Delivery to: ${this.order.deliveryInfo.address}, ${this.order.deliveryInfo.city}</span>
                <strong>Total: $${this.order.totalPrice.toFixed(2)}</strong>
            </div>
        `;
        return div;
    }

    getElement(): HTMLElement {
        return this.element;
    }
}