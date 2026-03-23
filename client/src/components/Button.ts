export class Button {
    private element: HTMLButtonElement;

    constructor(text: string, variant: 'primary' | 'secondary' = 'primary', onClick?: () => void) {
        this.element = document.createElement('button');
        this.element.className = btn btn-${variant};
        this.element.textContent = text;
        
        if (onClick) {
            this.element.addEventListener('click', onClick);
        }
    }

    getElement(): HTMLButtonElement {
        return this.element;
    }
}