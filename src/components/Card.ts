import { IProduct, IClickHandler, ICard } from '../types';
import { CDN_URL, category } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/component';

export interface IProductAndClick {
	product: IProduct;
	onClick: IClickHandler;
}

export class Card extends Component<ICard> {
	product: IProduct;
	private _price: HTMLElement;

	constructor(container: HTMLElement, productAndClick: IProductAndClick) {
		super(container);

		const product = productAndClick.product;
		this.product = product;

		const _title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		const _category: HTMLElement = container.querySelector(`.card__category`);
		const _img = container.querySelector(`.card__image`) as HTMLImageElement;

		this.setText(_title, product.title);
		this.setText(
			this._price,
			product.price == null ? 'Бесценно' : String(product.price) + ' синапсов'
		);

		if (_category !== null) {
			this.setText(_category, product.category);
			this.toggleClass(
				_category,
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
