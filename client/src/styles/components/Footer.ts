export class Footer {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('footer');
        this.element.className = 'footer';
        this.element.innerHTML = `
            <p>© 2024 AAA Game Store. All rights reserved.</p>
        `;
    }

    getElement(): HTMLElement {
        return this.element;
    }
}