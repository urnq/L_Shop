export class DeliveryForm {
    private element: HTMLElement;
    private paymentMethod: string = 'card';
    private onSubmit: (data: any) => void;

    constructor(onSubmit: (data: any) => void) {
        this.onSubmit = onSubmit;
        this.element = this.render();
        this.setupEventListeners();
    }

    private render(): HTMLElement {
        const form = document.createElement('form');
        form.className = 'delivery-form';
        form.setAttribute('data-delivery-form', 'true');
        form.innerHTML = `
            <h3>Delivery Information</h3>
            <input type="text" id="address" placeholder="Street Address" data-delivery-address required>
            <input type="text" id="city" placeholder="City" data-delivery-city required>
            <input type="text" id="postalCode" placeholder="Postal Code" data-delivery-postal required>
            <input type="tel" id="phone" placeholder="Phone" data-delivery-phone required>
            <input type="email" id="email" placeholder="Email" data-delivery-email required>
            
            <h3>Payment Method</h3>
            <div class="payment-method">
                <label>
                    <input type="radio" name="payment" value="card" checked> Credit Card
                </label>
                <label>
                    <input type="radio" name="payment" value="cash"> Cash on Delivery
                </label>
            </div>
            
            <div id="card-details" class="card-details">
                <input type="text" placeholder="Card Number">
                <input type="text" placeholder="Card Holder Name">
                <div style="display: flex; gap: 1rem;">
                    <input type="text" placeholder="MM/YY" style="flex: 1;">
                    <input type="text" placeholder="CVV" style="flex: 1;">
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary">Place Order</button>
        `;
        return form;
    }

    private setupEventListeners(): void {
        this.element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const paymentRadios = this.element.querySelectorAll('input[name="payment"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                this.paymentMethod = target.value;
                const cardDetails = this.element.querySelector('#card-details');
                if (cardDetails) {
                    (cardDetails as HTMLElement).style.display = this.paymentMethod === 'card' ? 'block' : 'none';
                }
            });
        });
    }

    private handleSubmit(): void {
        const address = (this.element.querySelector('#address') as HTMLInputElement).value;
        const city = (this.element.querySelector('#city') as HTMLInputElement).value;
        const postalCode = (this.element.querySelector('#postalCode') as HTMLInputElement).value;
        const phone = (this.element.querySelector('#phone') as HTMLInputElement).value;
        const email = (this.element.querySelector('#email') as HTMLInputElement).value;

        if (!address  !city  !postalCode  !phone  !email) {
            alert('Please fill all delivery fields');
            return;
        }

        this.onSubmit({
            address,
            city,
            postalCode,
            phone,
            email
        });
    }

    getElement(): HTMLElement {
        return this.element;
    }
}