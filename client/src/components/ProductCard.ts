import { cartStore } from '../store/cartStore';

export class ProductCard {
    private element: HTMLElement;
    private product: any;

    constructor(product: any, onAddToCart?: () => void) {
        this.product = product;
        this.element = this.render();
        
        const addButton = this.element.querySelector('.add-to-cart');
        if (addButton) {
            addButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                await cartStore.addToCart(product.id, 1);
                if (onAddToCart) onAddToCart();
            });
        }
    }

    private render(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-card__image">
                <img src="${this.product.image}" alt="${this.product.title}">
                ${!this.product.inStock ? '<span class="product-card__badge">Out of Stock</span>' : ''}
            </div>
            <div class="product-card__content">
                <h3 class="product-card__title" data-title="${this.product.title}">${this.product.title}</h3>
                <div class="product-card__meta">
                    <span class="product-card__platform">${this.product.platform}</span>
                    <span class="product-card__year">${this.product.releaseYear}</span>
                    <span class="product-card__rating">⭐️ ${this.product.rating}</span>
                </div>
                <p class="product-card__description">${this.product.description.substring(0, 100)}...</p>
                <div class="product-card__footer">
                    <span class="product-card__price" data-price="${this.product.price}">$${this.product.price.toFixed(2)}</span>
                    <button class="add-to-cart" ${!this.product.inStock ? 'disabled' : ''}>
                        ${this.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `;
        return card;
    }

    getElement(): HTMLElement {
        return this.element;
    }
}