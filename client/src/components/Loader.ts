export class Loader {
    private element: HTMLElement;

    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'loader';
        this.element.innerHTML = '<div class="spinner"></div>';
    }

    show(): void {
        this.element.style.display = 'flex';
    }

    hide(): void {
        this.element.style.display = 'none';
    }

    getElement(): HTMLElement {
        return this.element;
    }
}