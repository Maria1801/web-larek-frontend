import { IProduct } from '../types';
import { copyTemplate } from '../utils/utils';
import { Card } from './Card';
import { EventEmitter } from './base/events';

export interface IBasket {
	renderCounter(amount: number): void;
	updateList(productList: IProduct[]): void;
}

export class Basket implements IBasket {
	protected _counter: HTMLElement;
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	container: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		this.container = container;
		this._counter = document.getElementsByClassName(
			'header__basket-counter'
		)[0] as HTMLElement;
		this._list = container.getElementsByClassName(
			'basket__list'
		)[0] as HTMLElement;
		this._price = container.getElementsByClassName(
			'basket__price'
		)[0] as HTMLElement;
		this._button = container.getElementsByClassName(
			'basket__button'
		)[0] as HTMLButtonElement;

		this._button.disabled = true;
		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:init');
			});
		}
	}

	renderCounter(amount: number): void {
		this._counter.textContent = String(amount);
	}
	updateList(productList: IProduct[]): void {
		if (productList.length > 0) {
			this._button.disabled = false;
		} else {
			this._button.disabled = true;
		}

		let totalPrice = 0;
		productList.map((product) => {
			totalPrice += product.price;
		});
		this._price.textContent = String(totalPrice) + ' синапсов';

		const cards: HTMLElement[] = productList.map((product, index) => {
			const copy = copyTemplate('card-basket');
			const card = new Card(
				copy as HTMLElement,
				{
					product: product,
					onClick: {
						onClick: (event: MouseEvent) => {
							this.events.emit('basket:delete', product);
						},
					},
				},
				this.events
			);
			const _card: HTMLElement = card.render();
			_card.querySelector('.basket__item-index').textContent = String(
				index + 1
			);
			return _card;
		});

		this._list.replaceChildren(...cards);
	}
}
