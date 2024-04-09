import { PAYMENT_METHOD, IForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Form extends Component<IForm> {
	protected error: HTMLElement;
	protected isPaymentSelected: boolean;
	protected inputs: HTMLInputElement[];
	protected paymentButtons: HTMLElement[];
	protected submit: HTMLButtonElement;
	protected paymentMethod: PAYMENT_METHOD;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.inputs = Array.from(this.container.querySelectorAll('.form__input'));
		this.submit = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
		this.error = ensureElement<HTMLElement>('.form__errors', this.container);

		this.paymentButtons = Array.prototype.slice.call(
			container.getElementsByClassName('button_alt')
		);
		this.cleanError();

		if (this.submit.classList.contains('order__button')) {
			this.submit.addEventListener('click', () => {
				const address = this.inputs[0].value;
				const payment = this.paymentMethod;
				events.emit('order:contacts', {
					payment: payment,
					address: address,
				});
			});
		} else {
			this.submit.addEventListener('click', () => {
				const email = this.inputs[0].value;
				const telephone = this.inputs[1].value;
				events.emit('order:post', {
					email: email,
					telephone: telephone,
				});
			});
		}

		if (this.paymentButtons.length != 0) {
			this.isPaymentSelected = false;
			this.paymentButtons.forEach((element) => {
				element.addEventListener('click', (event) => {
					this.toggleSelected(event.currentTarget as HTMLElement);
				});
			});
		} else {
			this.isPaymentSelected = true;
		}

		this.inputs.forEach((element) => {
			element.addEventListener('input', (event) => {
				this.showError(element);
				this.updateValidation();
			});
		});
	}

	toggleSelected(button: HTMLElement) {
		if (button.innerText == PAYMENT_METHOD.ONLINE) {
			this.paymentMethod = PAYMENT_METHOD.ONLINE;
		} else {
			this.paymentMethod = PAYMENT_METHOD.RECEIVED;
		}
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
		this.inputs.forEach((element: HTMLInputElement) => {
			if (element.value === '' || element.validity.valid !== true) {
				isValidInputs = false;
			}
		});

		if (isValidInputs && this.isPaymentSelected) {
			this.setDisabled(this.submit, false);
		} else {
			this.setDisabled(this.submit, true);
		}
	}

	showError(element: HTMLInputElement) {
		if (element.validity.valid) {
			this.cleanError();
		} else {
			if (element.validity.patternMismatch) {
				this.setText(this.error, element.dataset.errorMessage )
			} else {
				this.setText(this.error, element.validationMessage )
			}
			this.error.style.removeProperty('display');
		}
	}

	cleanError() {
		this.setText(this.error, '' )
		this.setHidden(this.error);
	}

	render() {
		return this.container;
	}
}
