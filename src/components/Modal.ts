import { IModal } from '../types';
import { CDN_URL, category } from '../utils/constants';
import { copyTemplate } from '../utils/utils';
import { IProductAndClick } from './Card';
import { IEvents } from './base/events';

export class Modal implements IModal {
	closeBtn: HTMLButtonElement;
	_content: HTMLElement;
	container: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		this.container = container;
		this.closeBtn = container.getElementsByClassName(
			'modal__close'
		)[0] as HTMLButtonElement;
		this._content = container.getElementsByClassName(
			'modal__content'
		)[0] as HTMLElement;

		this.closeBtn.addEventListener('click', this.hideModal.bind(this));
		this.container.addEventListener('click', this.hideModal.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	renderSelectedProduct(productAndClick: IProductAndClick): void {
		const container = copyTemplate('card-preview');
		const product = productAndClick.product;

		const _title: HTMLElement = container.querySelector(
			`.card__title`
		) as HTMLElement;
		const _price = container.querySelector(`.card__price`) as HTMLSpanElement;
		const _category = container.querySelector(`.card__category`);
		const _description = container.querySelector(`.card__text`);
		const _img = container.querySelector(`.card__image`) as HTMLImageElement;
		const _btn = container.querySelector(`.card__button`) as HTMLButtonElement;

		_title.textContent = product.title;
		_price.textContent =
			product.price == null ? 'Бесценно' : String(product.price) + ' синапсов';
		_category.textContent = product.category;
		_category.classList.toggle(
			'card__category_' + category.get(product.category),
			true
		);
		_description.textContent = product.description;
		_img.src = CDN_URL + product.image;
		_img.alt = product.title;
		_btn.addEventListener('click', productAndClick.onClick.onClick);

		this._content.replaceChildren(container);
		this.showModal();
	}

	renderContainer(container: HTMLElement): void {
		this._content.replaceChildren(container);
		this.showModal();
	}

	showModal(): void {
		this.container.classList.add('modal_active');
		document.body.classList.add('page__wrapper_locked');
	}
	hideModal(): void {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren(null);
		document.body.classList.remove('page__wrapper_locked');
	}
}
