export type ApiListResponse = {
	total: number;
	items: IProduct[];
};

export type ApiPostResponse = {
	id: string;
	total: number;
};

export enum PAYMENT_METHOD {
	ONLINE = 'Онлайн',
	RECEIVED = 'При получении',
}

export interface IForm {
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

export interface ILarekApi {
	productList(): Promise<ApiListResponse | void>;
	productItem(id: string): Promise<IProduct | void>;
	submitOrder(order: IOrder): void;
}

export interface IProductAndClick {
	product: IProduct;
	onClick: IClickHandler;
}
