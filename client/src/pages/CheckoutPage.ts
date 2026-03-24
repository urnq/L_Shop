import { api } from '../services/api';
import { cartStore } from '../store/cartStore';
import { DeliveryForm } from '../components/DeliveryForm';

export class CheckoutPage {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async init(): Promise<void> {
        await cartStore.loadCart();
        const { items } = cartStore.getState();
        
        if (!items || items.length === 0) {
            this.container.innerHTML = `
                <div class="cart-empty">
                    <h2>Your cart is empty</h2>
                    <a href="/" class="btn btn-primary" data-link>Continue Shopping</a>
                </div>
            `;
            return;
        }

        this.render();
    }

    private render(): void {
        const { items, totalPrice } = cartStore.getState();
        
        this.container.innerHTML = `
            <div class="checkout-page">
                <h2>Checkout</h2>
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div id="order-items"></div>
                    <div class="order-total">
                        <strong>Total: $${totalPrice.toFixed(2)}</strong>
                    </div>
                </div>
                <div id="delivery-form-container"></div>
            </div>
        `;

        // Рендерим товары в заказе
        const orderItemsContainer = document.getElementById('order-items');
        if (orderItemsContainer) {
            items.forEach(item => {
                const product = item.product;
                if (product) {
                    const div = document.createElement('div');
                    div.className = 'order-item';
                    div.innerHTML = `
                        <span>${product.title} x ${item.quantity}</span>
                        <span>$${(product.price * item.quantity).toFixed(2)}</span>
                    `;
                    orderItemsContainer.appendChild(div);
                }
            });
        }

        // Рендерим форму доставки
        const formContainer = document.getElementById('delivery-form-container');
        if (formContainer) {
            const form = new DeliveryForm(async (deliveryData) => {
                const { paymentMethod, ...deliveryInfo } = deliveryData;
                
                const response = await api.createOrder(deliveryInfo, paymentMethod);
                
                if (response.success) {
                    await cartStore.loadCart();
                    alert('Order placed successfully!');
                    window.location.href = '/orders';
                } else {
                    alert('Failed to place order. Please try again.');
                }
            });
            formContainer.appendChild(form.getElement());
        }
    }

    destroy(): void {
        this.container.innerHTML = '';
    }
}
