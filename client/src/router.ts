import { HomePage } from './pages/HomePage';

type PageConstructor = new (container: HTMLElement, ...args: any[]) => any;

export class Router {
    private container: HTMLElement;
    private currentPage: any = null;
    private routes: Map<string, PageConstructor> = new Map();
    private cartUpdateCallbacks: (() => void)[] = [];

    constructor(container: HTMLElement) {
        this.container = container;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.routes.set('/', HomePage);
        // Временные заглушки для страниц Паши
        this.routes.set('/auth', class { constructor() {} async init() {} destroy() {} });
        this.routes.set('/cart', class { constructor() {} async init() {} destroy() {} });
        this.routes.set('/checkout', class { constructor() {} async init() {} destroy() {} });
        this.routes.set('/orders', class { constructor() {} async init() {} destroy() {} });
    }

    public init(): void {
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname);
        });

        document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('[data-link]');
            
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    this.navigate(href);
                }
            }
        });

        this.navigate(window.location.pathname);
    }

    public navigate(path: string): void {
        window.history.pushState({}, '', path);
        this.loadPage(path);
    }

    private async loadPage(path: string): Promise<void> {
        const PageClass = this.routes.get(path);
        
        if (!PageClass) {
            this.loadPage('/');
            return;
        }

        if (this.currentPage && this.currentPage.destroy) {
            this.currentPage.destroy();
        }

        this.container.innerHTML = '';
        
        this.currentPage = new PageClass(this.container);
        
        if (this.currentPage && this.currentPage.init) {
            await this.currentPage.init();
        }
    }

    public onCartUpdate(callback: () => void): void {
        this.cartUpdateCallbacks.push(callback);
    }

    public triggerCartUpdate(): void {
        this.cartUpdateCallbacks.forEach(cb => cb());
    }
}