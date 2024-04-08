export type ApiListResponse = {
	total: number;
	items: IProduct[];
};

export enum PAYMENT_METHOD {
	ONLINE = 'Онлайн',
	RECEIVED = 'При получении',
}

export interface IForm {
	render(): HTMLElement;
	updateValidation(): void;
	toggleSelected(button: HTMLElement): void;
	showError(element: HTMLInputElement): void;
	cleanError(): void;
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IOrderForm {
	address: string;
	email: string;
	phone: string;
}

export interface IAppData {
	productList: IProduct[];
	basketList: IProduct[];
}

export interface AddressForm {
	payment: PAYMENT_METHOD;
	address: string;
}

export interface ContactsForm {
	email: string;
	telephone: string;
}

export interface IClickHandler {
	onClick: (event: MouseEvent) => void;
}

export interface ICard {
	render(): HTMLElement;
}

export interface IAppDataManager {
	setProductList(productList: IProduct[]): void;
	makeOrder(contactsForm: ContactsForm): IOrder;
	cleanOrder(): void;
}

export interface ILarekApi {
	productList(): Promise<ApiListResponse | void>; // todo changed
	productItem(id: string): IProduct;
	submitOrder(order: IOrder): void;
}

export interface IModal {
	showModal(): void;
	hideModal(): void;
	renderSelectedProduct(productAndClick: IProductAndClick): void;
	renderContainer(container: HTMLElement): void;
}

export interface IProductAndClick {
	product: IProduct;
	onClick: IClickHandler;
}
