import { CartItem as CartItemType } from '../types';
import { cartStore } from '../store/cartStore';

export class CartItemComponent {
    private element: HTMLElement;
    private item: CartItemType;

    constructor(item: CartItemType, onUpdate: () => void) {
        this.item = item;
        this.element = this.render();
        this.setupEventListeners(onUpdate);
    }

    private render(): HTMLElement {
        const product = this.item.product;
        if (!product) return document.createElement('div');

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img class="cart-item__image" src="${product.image}" alt="${product.title}">
            <div class="cart-item__details">
                <h3 data-title="basket">${product.title}</h3>
                <p class="cart-item__price" data-price="basket">$${product.price.toFixed(2)}</p>
                <div class="cart-item__quantity">
                    <button class="quantity-btn" data-action="decrease">-</button>
                    <span class="quantity">${this.item.quantity}</span>
                    <button class="quantity-btn" data-action="increase">+</button>
                    <button class="remove-btn" data-action="remove">Remove</button>
                </div>
            </div>
        `;
        return div;
    }

    private setupEventListeners(onUpdate: () => void): void {
        const decreaseBtn = this.element.querySelector('[data-action="decrease"]');
        const increaseBtn = this.element.querySelector('[data-action="increase"]');
        const removeBtn = this.element.querySelector('[data-action="remove"]');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', async () => {
                if (this.item.quantity > 1) {
                    await cartStore.updateQuantity(this.item.productId, this.item.quantity - 1);
                } else {
                    await cartStore.removeFromCart(this.item.productId);
                }
                onUpdate();
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', async () => {
                await cartStore.updateQuantity(this.item.productId, this.item.quantity + 1);
                onUpdate();
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', async () => {
                await cartStore.removeFromCart(this.item.productId);
                onUpdate();
            });
        }
    }

    getElement(): HTMLElement {
        return this.element;
    }
}