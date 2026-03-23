import { cartStore } from '../store/cartStore';
import { CartItemComponent } from '../components/CartItem';

export class CartPage {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async init(): Promise<void> {
        await cartStore.loadCart();
        this.render();
    }

    private render(): void {
        const { items, totalPrice } = cartStore.getState();
        
        if (!items || items.length === 0) {
            this.container.innerHTML = `
                <div class="cart-empty">
                    <h2>Your cart is empty</h2>
                    <a href="/" class="btn btn-primary" data-link>Continue Shopping</a>
                </div>
            `;
            return;
        }

        this.container.innerHTML = `
            <div class="cart-page">
                <h2>Shopping Cart</h2>
                <div class="cart-items" id="cart-items"></div>
                <div class="cart-summary">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span class="total-price" data-total-price="${totalPrice}">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <button id="checkout-btn" class="checkout-btn">Proceed to Checkout</button>
                </div>
            </div>
        `;

        this.renderCartItems();
        this.setupEventListeners();
    }

    private renderCartItems(): void {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        const { items } = cartStore.getState();
        cartItemsContainer.innerHTML = '';

        items.forEach(item => {
            const cartItem = new CartItemComponent(item, () => this.refresh());
            cartItemsContainer.appendChild(cartItem.getElement());
        });
    }

    private setupEventListeners(): void {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = '/checkout';
            });
        }
    }

    private async refresh(): Promise<void> {
        await cartStore.loadCart();
        this.render();
    }

    destroy(): void {
        this.container.innerHTML = '';
    }
}
