import { IProduct } from '../types';
import { copyTemplate, ensureElement } from '../utils/utils';
import { Card } from './Card';
import { Component } from './base/component';
import { EventEmitter } from './base/events';

export interface IBasket {
	_list: HTMLElement;
	_price: HTMLElement;
	_button: HTMLButtonElement;
}

export class Basket extends Component<IBasket> {
	protected _counter: HTMLElement;
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	container: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this.container = container;

		this._counter = document.getElementsByClassName(
			'header__basket-counter'
		)[0] as HTMLElement;
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

	renderCounter(amount: number): void {
		this.setText(this._counter, amount);
	}
	updateList(productList: IProduct[]): void {
		if (productList.length > 0) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}

		let totalPrice = 0;
		productList.map((product) => {
			totalPrice += product.price;
		});

		this.setText(this._price, String(totalPrice) + ' синапсов');
		const cards: HTMLElement[] = productList.map((product, index) => {
			const copy = copyTemplate('card-basket');
			const card = new Card(copy as HTMLElement, {
				product: product,
				onClick: {
					onClick: (event: MouseEvent) => {
						this.events.emit('basket:delete', product);
					},
				},
			});
			const _card: HTMLElement = card.render();
			this.setText(_card.querySelector('.basket__item-index'), index + 1);
			return _card;
		});

		this._list.replaceChildren(...cards);
	}
}
