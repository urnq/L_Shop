import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Filters } from '../components/Filters';
import { Loader } from '../components/Loader';

export class HomePage {
    private container: HTMLElement;
    private products: any[] = [];
    private filters: any = {};
    private loader: Loader;
    private productsContainer!: HTMLElement;
    private onCartUpdate: () => void;

    constructor(container: HTMLElement, onCartUpdate?: () => void) {
        this.container = container;
        this.onCartUpdate = onCartUpdate || (() => {});
        this.loader = new Loader();
    }

    async init(): Promise<void> {
        this.render();
        await this.loadProducts();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="home-page">
                <div class="products-grid" id="products-grid"></div>
            </div>
        `;
        
        const grid = document.getElementById('products-grid');
        if (grid) {
            const filters = new Filters((filtersData) => {
                this.filters = filtersData;
                this.loadProducts();
            });
            grid.appendChild(filters.getElement());
            
            this.productsContainer = document.createElement('div');
            this.productsContainer.className = 'products-list';
            grid.appendChild(this.productsContainer);
            this.productsContainer.appendChild(this.loader.getElement());
        }
    }

    private async loadProducts(): Promise<void> {
        this.loader.show();
        
        const response = await api.getProducts(this.filters);
        
        if (response.success && response.data) {
            this.products = response.data;
            this.renderProducts();
        }
        
        this.loader.hide();
    }

    private renderProducts(): void {
        if (!this.productsContainer) return;
        
        this.productsContainer.innerHTML = '';
        
        if (this.products.length === 0) {
            this.productsContainer.innerHTML = '<p class="no-products">No products found</p>';
            return;
        }

        this.products.forEach(product => {
            const card = new ProductCard(product, () => this.onCartUpdate());
            this.productsContainer.appendChild(card.getElement());
        });
    }

    destroy(): void {
        this.container.innerHTML = '';
    }
}