import { authStore } from '../store/authStore';

export class AuthForm {
    private element: HTMLElement;
    private isLogin: boolean = true;
    private onSubmit: () => void;
    private loading: boolean = false;

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
            <h2>${this.isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p class="auth-subtitle">${this.isLogin ? 'Sign in to continue shopping' : 'Join us and start gaming'}</p>
            <form id="auth-form">
                ${!this.isLogin ? `
                    <div class="form-group">
                        <input type="text" id="username" placeholder="Username" required>
                    </div>
                ` : ''}
                <div class="form-group">
                    <input type="email" id="email" placeholder="Email address" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                ${!this.isLogin ? `
                    <div class="form-group">
                        <input type="tel" id="phone" placeholder="Phone (optional)">
                    </div>
                ` : ''}
                <button type="submit" class="btn btn-primary" ${this.loading ? 'disabled' : ''}>
                    ${this.loading ? 'Please wait...' : (this.isLogin ? 'Sign In' : 'Create Account')}
                </button>
            </form>
            <div class="auth-switch">
                <button id="switch-auth" class="btn-link">
                    ${this.isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span class="link-highlight">${this.isLogin ? 'Sign Up' : 'Sign In'}</span>
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

    private showMessage(message: string, isError: boolean = true): void {
        const existingMsg = this.element.querySelector('.auth-error, .auth-success');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = isError ? 'auth-error' : 'auth-success';
        msgDiv.textContent = message;
        
        const form = this.element.querySelector('#auth-form');
        if (form && form.parentElement) {
            form.parentElement.insertBefore(msgDiv, form);
        }
    }

    private async handleSubmit(): Promise<void> {
        const email = (this.element.querySelector('#email') as HTMLInputElement).value;
        const password = (this.element.querySelector('#password') as HTMLInputElement).value;
        
        if (!email || !password) {
            this.showMessage('Please fill in all required fields');
            return;
        }

        // Clear previous messages
        const existingMsg = this.element.querySelector('.auth-error, .auth-success');
        if (existingMsg) existingMsg.remove();

        this.loading = true;
        this.updateSubmitButton();
        
        let success = false;
        let errorMessage = '';
        
        if (this.isLogin) {
            success = await authStore.login(email, password);
            if (!success) errorMessage = 'Invalid email or password';
        } else {
            const username = (this.element.querySelector('#username') as HTMLInputElement).value;
            const phone = (this.element.querySelector('#phone') as HTMLInputElement)?.value;
            
            if (!username) {
                this.showMessage('Username is required');
                this.loading = false;
                this.updateSubmitButton();
                return;
            }
            
            success = await authStore.register(username, email, password, phone);
            if (!success) errorMessage = 'Registration failed. Email may already be in use.';
        }
        
        this.loading = false;
        this.updateSubmitButton();
        
        if (success) {
            this.showMessage(this.isLogin ? 'Login successful!' : 'Account created successfully!', false);
            setTimeout(() => {
                this.onSubmit();
            }, 500);
        } else {
            this.showMessage(errorMessage);
        }
    }

    private updateSubmitButton(): void {
        const btn = this.element.querySelector('button[type="submit"]');
        if (btn) {
            btn.textContent = this.loading ? 'Please wait...' : (this.isLogin ? 'Sign In' : 'Create Account');
            btn.setAttribute('disabled', this.loading ? 'true' : 'false');
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