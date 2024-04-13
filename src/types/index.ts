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

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IForm {
	updateValidation(): void;
	toggleSelected(button: HTMLElement): void;
	showError(element: HTMLInputElement): void;
	cleanError(): void;
}

export type ProductPrice = number | null;

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: ProductPrice;
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
