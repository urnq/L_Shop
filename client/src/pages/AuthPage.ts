import { AuthForm } from '../components/AuthForm';

export class AuthPage {
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
    }

    async init(): Promise<void> {
        this.render();
    }

    private render(): void {
        this.container.innerHTML = `
            <div class="auth-page">
                <div id="auth-form-container"></div>
            </div>
        `;
        
        const formContainer = document.getElementById('auth-form-container');
        if (formContainer) {
            const form = new AuthForm(() => {
                window.location.href = '/';
            });
            formContainer.appendChild(form.getElement());
        }
    }

    destroy(): void {
        this.container.innerHTML = '';
    }
}