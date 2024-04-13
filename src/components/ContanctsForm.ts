import { IOrder } from '../types';
import {IEvents} from './base/events';
import { Form } from './common/Form';

export interface IContactsForm {
    phone?: string;
    email?: string;
}

export class Contacts extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value = value;
	}

    checkErrors(order: IOrder){
        this.errors = '';
        if (order.email === '') {
            this.errors = 'Введите email';
        }
        if (order.phone === '') {
            this.errors = 'Введите телефон';
        }
    }
}