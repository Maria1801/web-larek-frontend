import { copyTemplate } from '../utils/utils';
import { Card, IProductAndClick } from './Card';
import { IEvents } from './base/events';

export class MainPage {
	protected _catalog: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		this._catalog = document.getElementsByClassName(
			'gallery'
		)[0] as HTMLElement;
		this._basket = document.getElementsByClassName(
			'header__basket'
		)[0] as HTMLElement;

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:render');
		});
	}

	set catalog(products: IProductAndClick[]) {
		const cards: HTMLElement[] = products.map((productAndClick) => {
			const copy = copyTemplate('card-catalog');
			const card = new Card(copy as HTMLElement, productAndClick, this.events);
			return card.render();
		});

		this._catalog.replaceChildren(...cards);
	}
}
