export class Filters {
    private element: HTMLElement;
    private onApply: (filters: any) => void;

    constructor(onApply: (filters: any) => void) {
        this.onApply = onApply;
        this.element = this.render();
        this.setupEventListeners();
    }

    private render(): HTMLElement {
        const aside = document.createElement('aside');
        aside.className = 'filters-sidebar';
        aside.innerHTML = `
            <h3>Filters</h3>
            <div class="filter-group">
                <label>Search</label>
                <input type="text" id="search-input" placeholder="Search games...">
            </div>
            <div class="filter-group">
                <label>Category</label>
                <select id="category-select">
                    <option value="">All</option>
                    <option value="Action RPG">Action RPG</option>
                    <option value="Action Adventure">Action Adventure</option>
                    <option value="RPG">RPG</option>
                    <option value="Platformer">Platformer</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Platform</label>
                <select id="platform-select">
                    <option value="">All</option>
                    <option value="PC">PC</option>
                    <option value="PS5">PS5</option>
                    <option value="Xbox Series X">Xbox Series X</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Price Range</label>
                <div class="price-range">
                    <input type="number" id="min-price" placeholder="Min" step="10">
                    <span>-</span>
                    <input type="number" id="max-price" placeholder="Max" step="10">
                </div>
            </div>
            <div class="filter-group">
                <label>
                    <input type="checkbox" id="in-stock-only"> In Stock Only
                </label>
            </div>
            <div class="filter-group">
                <label>Sort By</label>
                <select id="sort-select">
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                </select>
            </div>
            <button id="apply-filters" class="apply-filters-btn">Apply Filters</button>
        `;
        return aside;
    }

    private setupEventListeners(): void {
        const applyButton = this.element.querySelector('#apply-filters');
        if (applyButton) {
            applyButton.addEventListener('click', () => {
                const filters = this.getFilters();
                this.onApply(filters);
            });
        }
    }

    getFilters(): any {
        const search = (this.element.querySelector('#search-input') as HTMLInputElement)?.value;
        const category = (this.element.querySelector('#category-select') as HTMLSelectElement)?.value;
        const platform = (this.element.querySelector('#platform-select') as HTMLSelectElement)?.value;
        const minPrice = (this.element.querySelector('#min-price') as HTMLInputElement)?.value;
        const maxPrice = (this.element.querySelector('#max-price') as HTMLInputElement)?.value;
        const inStockOnly = (this.element.querySelector('#in-stock-only') as HTMLInputElement)?.checked;
        const sortBy = (this.element.querySelector('#sort-select') as HTMLSelectElement)?.value;
        return {
            ...(search && { search }),
            ...(category && { category }),
            ...(platform && { platform }),
            ...(minPrice && { minPrice: Number(minPrice) }),
            ...(maxPrice && { maxPrice: Number(maxPrice) }),
            ...(inStockOnly && { inStock: true }),
            ...(sortBy && { sortBy })
        };
    }

    getElement(): HTMLElement {
        return this.element;
    }
}