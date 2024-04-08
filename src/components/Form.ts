import { PAYMENT_METHOD, IForm } from '../types';
import { IEvents } from './base/events';

export class Form implements IForm {
	protected error: HTMLElement;
	protected container: HTMLElement;
	protected isPaymentSelected: boolean;
	protected _button: HTMLElement;
	protected _actions: HTMLElement;
	protected _inputs: HTMLInputElement[];
	protected _paymentButtons: HTMLElement[];
	protected _submit: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		this.container = container;

		this._inputs = Array.from(this.container.querySelectorAll('.form__input'));
		this._actions = container.querySelector('.modal__actions');
		this._button = this._actions.querySelector('.button');
		this._submit = container.querySelectorAll(
			'.button[type=submit]'
		)[0] as HTMLButtonElement;
		this._paymentButtons = Array.prototype.slice.call(
			container.getElementsByClassName('button_alt')
		);
		this.error = this.container.getElementsByClassName(
			'form__errors'
		)[0] as HTMLElement;
		this.cleanError();

		if (this._button.classList.contains('order__button')) {
			this._button.addEventListener('click', () => {
				const address = this._inputs[0].value;
				const payment = PAYMENT_METHOD.ONLINE;
				events.emit('order:contacts', {
					payment: payment,
					address: address,
				});
			});
		} else {
			this._button.addEventListener('click', () => {
				const email = this._inputs[0].value;
				const telephone = this._inputs[1].value;
				events.emit('order:post', {
					email: email,
					telephone: telephone,
				});
			});
		}

		if (this._paymentButtons.length != 0) {
			this.isPaymentSelected = false;
			this._paymentButtons.forEach((element) => {
				element.addEventListener('click', (event) => {
					this.toggleSelected(event.currentTarget as HTMLElement);
				});
			});
		} else {
			console.log('isPaymentSelected=' + this.isPaymentSelected);
			this.isPaymentSelected = true;
		}

		this._inputs.forEach((element) => {
			element.addEventListener('input', (event) => {
				this.showError(element);
				this.updateValidation();
			});
		});
	}

	toggleSelected(button: HTMLElement) {
		const activeButton = this.container.querySelector('.button_alt-active');
		if (activeButton) {
			activeButton.classList.toggle('button_alt-active');
		}
		button.classList.toggle('button_alt-active');

		this.isPaymentSelected = true;
		this.updateValidation();
	}

	updateValidation() {
		let isValidInputs = true;
		this._inputs.forEach((element: HTMLInputElement) => {
			if (element.value === '' || element.validity.valid !== true) {
				isValidInputs = false;
			}
		});

		if (isValidInputs && this.isPaymentSelected) {
			this._submit.disabled = false;
		} else {
			this._submit.disabled = true;
		}
	}

	showError(element: HTMLInputElement) {
		if (element.validity.valid) {
			this.cleanError();
		} else {
			element.validity.patternMismatch
				? (this.error.textContent = element.dataset.errorMessage)
				: (this.error.textContent = element.validationMessage);

			this.error.style.removeProperty('display');
		}
	}

	cleanError() {
		this.error.textContent = '';
		this.error.style.display = 'none';
	}

	render() {
		return this.container;
	}
}
