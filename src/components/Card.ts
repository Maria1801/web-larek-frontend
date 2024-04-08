import { IProduct, IClickHandler, ICard } from '../types';
import { CDN_URL, category } from '../utils/constants';
import { IEvents } from './base/events';

export interface IProductAndClick {
	product: IProduct;
	onClick: IClickHandler;
}

export class Card implements ICard {
	product: IProduct;
	protected container: HTMLElement;

	constructor(
		container: HTMLElement,
		productAndClick: IProductAndClick,
		events: IEvents
	) {
		const product = productAndClick.product;

		this.product = product;
		this.container = container;

		const _title: HTMLElement = container.querySelectorAll(
			`.card__title`
		)[0] as HTMLElement;
		const _price = container.querySelector(`.card__price`);
		const _category = container.querySelector(`.card__category`);
		const _img = container.querySelector(`.card__image`) as HTMLImageElement;

		_title.textContent = product.title;
		_price.textContent =
			product.price == null ? 'Бесценно' : String(product.price) + ' синапсов';
		if (_category !== null) {
			_category.textContent = product.category;
			_category.classList.toggle(
				'card__category_' + category.get(product.category),
				true
			);
		}
		if (_img !== null) {
			_img.src = CDN_URL + product.image;
			_img.alt = product.title;
		}
		this.container.addEventListener('click', productAndClick.onClick.onClick);
	}

	render(): HTMLElement {
		return this.container;
	}
}
