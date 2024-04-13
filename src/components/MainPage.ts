import { IProduct } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Card } from './Card';
import { Component } from './base/component';
import { IEvents } from './base/events';

export interface IMainPage {
	counter: number;
	catalog: IProduct[];
}

export class MainPage extends Component<IMainPage> {
	private _catalog: HTMLElement;
	private _counter: HTMLElement;
	private _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		const _basket = ensureElement<HTMLElement>('.header__basket');

		_basket.addEventListener('click', () => {
			this.events.emit('basket:render');
		});
	}

	set catalog(productList: IProduct[]) {
		const cards = productList.map((product) => {
			const cardCatalog = new Card(
				cloneTemplate<HTMLTemplateElement>('#card-catalog')
			);
			return cardCatalog.render({
				product: product,
				handler: {
					onClick: () => {
						this.events.emit('card:select', product);
					},
				},
			});
		});

		this._catalog.replaceChildren(...cards);
	}

	set counter(count: number) {
		this.setText(this._counter, count);
	}

	set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}
