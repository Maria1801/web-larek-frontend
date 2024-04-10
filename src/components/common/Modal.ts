import { Component } from '../base/component';
import { IEvents } from '../base/events';

export interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	private closeBtn: HTMLButtonElement;
	private _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
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

	set content(container: HTMLElement) {
		this._content.replaceChildren(container);
	}

	showModal() {
		this.container.classList.add('modal_active');
		document.body.classList.add('page__wrapper_locked');
	}
	hideModal() {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren(null);
		document.body.classList.remove('page__wrapper_locked');
	}

	render(content: IModal) {
		super.render(content);
		this.showModal();
		return this._content;
	}
}
