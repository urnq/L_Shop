import { authStore } from '../store/authStore';

export class AuthForm {
    private element: HTMLElement;
    private isLogin: boolean = true;
    private onSubmit: () => void;

    constructor(onSubmit: () => void) {
        this.onSubmit = onSubmit;
        this.element = this.render();
        this.setupEventListeners();
    }

    private render(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'auth-form';
        div.setAttribute('data-registration', 'true');
        div.innerHTML = `
            <h2>${this.isLogin ? 'Login' : 'Register'}</h2>
            <form id="auth-form">
                ${!this.isLogin ? `
                    <input type="text" id="username" placeholder="Username" required>
                ` : ''}
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Password" required>
                ${!this.isLogin ? `
                    <input type="tel" id="phone" placeholder="Phone (optional)">
                ` : ''}
                <button type="submit" class="btn btn-primary">
                    ${this.isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <div class="auth-switch">
                <button id="switch-auth" class="btn-link">
                    ${this.isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
            </div>
        `;
        return div;
    }

    private setupEventListeners(): void {
        const form = this.element.querySelector('#auth-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });
        }

        const switchBtn = this.element.querySelector('#switch-auth');
        if (switchBtn) {
            switchBtn.addEventListener('click', () => {
                this.isLogin = !this.isLogin;
                this.refresh();
            });
        }
    }

    private async handleSubmit(): Promise<void> {
        const email = (this.element.querySelector('#email') as HTMLInputElement).value;
        const password = (this.element.querySelector('#password') as HTMLInputElement).value;
        
        let success = false;
        
        if (this.isLogin) {
            success = await authStore.login(email, password);
        } else {
            const username = (this.element.querySelector('#username') as HTMLInputElement).value;
            const phone = (this.element.querySelector('#phone') as HTMLInputElement)?.value;
            success = await authStore.register(username, email, password, phone);
        }
        
        if (success) {
            this.onSubmit();
        } else {
            alert('Authentication failed. Please try again.');
        }
    }

    private refresh(): void {
        const parent = this.element.parentElement;
        const newElement = this.render();
        this.element.replaceWith(newElement);
        this.element = newElement;
        this.setupEventListeners();
    }

    getElement(): HTMLElement {
        return this.element;
    }
}