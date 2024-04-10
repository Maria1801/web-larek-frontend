import { IProduct } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Card } from './Card';
import { Component } from './base/component';
import { EventEmitter } from './base/events';

export interface IBasket {
	list: IProduct[];
}

export class Basket extends Component<IBasket> {
	private _list: HTMLElement;
	private _price: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._button.disabled = true;
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:init');
			});
		}
	}

	set list(productList: IProduct[]) {
		if (productList.length > 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}

		const cards: HTMLElement[] = productList.map((product, index) => {
			const cardBasket = new Card(
				cloneTemplate<HTMLTemplateElement>('#card-basket')
			);
			const cardEl = cardBasket.render({
				product: product,
				handler: {
					onClick: (event: MouseEvent) => {
						this.events.emit('basket:delete', product);
					},
				},
			});
			this.setText(cardEl.querySelector('.basket__item-index'), index + 1);
			return cardEl;
		});

		this._list.replaceChildren(...cards);
		this.price = productList;
	}

	set price(productList: IProduct[]) {
		let totalPrice = 0;
		productList.map((product) => {
			totalPrice += product.price;
		});
		this.setText(this._price, String(totalPrice) + ' синапсов');
	}
}
