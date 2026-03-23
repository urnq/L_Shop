
export class Header {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('header');
        this.element.className = 'header';
        this.render();
    }

    private render(): void {
        this.element.innerHTML = `
            <div class="header__container">
                <a href="/" class="logo" data-link>🎮 AAA Game Store</a>
                <nav class="nav">
                    <a href="/" class="nav__link" data-link>Home</a>
                    <a href="/cart" class="nav__link cart-icon" data-link>
                        🛒 Cart
                        <span class="cart-count hidden">0</span>
                    </a>
                    <a href="/auth" class="nav__link" data-link>Login / Register</a>
                </nav>
            </div>
        `;
    }

    getElement(): HTMLElement {
        return this.element;
    }

    updateCartCount(count: number): void {
        const cartCount = this.element.querySelector('.cart-count');
        if (cartCount) {
            if (count > 0) {
                cartCount.textContent = count.toString();
                cartCount.classList.remove('hidden');
            } else {
                cartCount.classList.add('hidden');
            }
        }
    }
}