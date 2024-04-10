import { IProduct, IClickHandler } from '../types';
import { CDN_URL, category } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

export interface ICard {
	product: IProduct;
	handler: IClickHandler;
}

export class Card extends Component<ICard> {
	private _price: HTMLElement;
	private _title: HTMLElement;
	private _category: HTMLElement;
	private _img: HTMLImageElement;
	private _btn: HTMLButtonElement;
	private _description: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._category = container.querySelector(`.card__category`);
		this._img = container.querySelector(`.card__image`) as HTMLImageElement;
		this._btn = container.querySelector(`.card__button`) as HTMLButtonElement;
		this._description = container.querySelector(`.card__text`) as HTMLElement;
	}

	set product(product: IProduct) {
		this.setText(this._title, product.title);
		this.setText(
			this._price,
			product.price == null ? 'Бесценно' : String(product.price) + ' синапсов'
		);

		if (this._category !== null) {
			this.setText(this._category, product.category);
			this.toggleClass(
				this._category,
				'card__category_' + category.get(product.category),
				true
			);
		}
		if (this._img !== null) {
			this._img.src = CDN_URL + product.image;
			this._img.alt = product.title;
		}
		if (this._description !== null && this._btn !== null) {
			this.setText(this._description, product.description);
		}
	}

	set handler(handler: IClickHandler) {
		if (this._description !== null && this._btn !== null) {
			this._btn.addEventListener('click', handler.onClick);
		} else {
			this.container.addEventListener('click', handler.onClick);
		}
	}
}
