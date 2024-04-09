import { IClickHandler, IForm } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/component";

export class FormFinal extends Component<IForm>  {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, onClick: IClickHandler) {
		super(container);
		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

	    this._close.addEventListener('click', onClick.onClick);
	}

	setTotal(value: number) {
		this.setText(this._total, 'Списано ' + String(value) + ' синапсов');
	}

    render() {
		return this.container;
	}
}
