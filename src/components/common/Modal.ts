import { ensureElement } from '../../utils/utils';
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

		this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container); 
        this._content = ensureElement<HTMLElement>('.modal__content', container); 

		this.closeBtn.addEventListener('click', this.hideModal.bind(this));
		this.container.addEventListener('click', this.hideModal.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(container: HTMLElement) {
		this._content.replaceChildren(container);
	}

	showModal() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}
	hideModal() {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren(null);
        this.events.emit('modal:close');
	}

	render(content: IModal) {
		super.render(content);
		this.showModal();
		return this._content;
	}
}
