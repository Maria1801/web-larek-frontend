import { copyTemplate, ensureElement } from '../utils/utils';
import { Card, IProductAndClick } from './Card';
import { IEvents } from './base/events';

export class MainPage {
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;
	// protected _counter: HTMLElement;

	constructor(protected events: IEvents) {
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._basket = this._basket = ensureElement<HTMLElement>('.header__basket');
		// this._counter = ensureElement<HTMLElement>('header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:render');
		});
	}

	set catalog(products: IProductAndClick[]) {
		const cards: HTMLElement[] = products.map((productAndClick) => {
			const copy = copyTemplate('card-catalog');
			const card = new Card(copy as HTMLElement, productAndClick);
			return card.render();
		});

		this._catalog.replaceChildren(...cards);
	}
}
