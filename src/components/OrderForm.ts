import { IOrder } from '../types';
import { ensureAllElements } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface AddressForm {
	payment: string;
	address: string;
}

export class OrderForm extends Form<AddressForm> {
	protected _buttons: HTMLButtonElement[];

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
		this._buttons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this._buttons.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				events.emit('payment:change', button);
			});
		});
	}

	set payment(name: string) {
		this._buttons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

    checkErrors(order: IOrder){
        this.errors = '';
        if (order.address === '') {
            this.errors = 'Введите адресс';
        }
        if (order.payment === '') {
            this.errors = 'Выберете способ оплаты';
        }
    }
}
