import { IProduct, IOrder, ContactsForm, FormErrors } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/model';

export interface IAppDataManager {
	productList: IProduct[];
	basketList: IProduct[];
	setProductList(productList: IProduct[]): void;
	addBasketProduct(product: IProduct): void;
	removeBasketProduct(product: IProduct): void;
	makeOrder(contactsForm: ContactsForm): IOrder;
	isProductInBasket(product: IProduct):boolean;
}

export class AppDataManager extends Model<IAppDataManager> {
	productList: IProduct[];
	basketList: IProduct[];
	order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		total: 0,
		items: []
	};
	formErrors: FormErrors = {};

	constructor(events: IEvents) {
		super(
			{
				productList: [],
				basketList: [],
			},
			events
		);
	}

	setProductList(productList: IProduct[]) {
		this.productList = productList;
		this.emitChanges('productList:changed', { productList: this.productList });
	}

	isProductInBasket(product: IProduct): boolean {
		return this.basketList.includes(product);
	}

	addBasketProduct(product: IProduct) {
		if (!this.isProductInBasket(product)) {
			this.basketList.push(product);
		}
	}

	removeBasketProduct(product: IProduct) {
		const index = this.basketList.indexOf(product, 0);
		if (index > -1) {
			this.basketList.splice(index, 1);
		}
	}

	makeOrder(): IOrder {
		this.order.items = this.basketList.map((product: IProduct) => {
			this.order.total += product.price;
			return product.id;
		});
		const orderReturn = this.order;
		this.basketList = [];
		this.order = {
			payment: '',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: []
		};

		return orderReturn;
	}

	isValidContactsForm(): boolean {
		return (this.order.address !== '' && this.order.payment !== '') ? true : false;
	}

	isValidAddressForm(): boolean {
		return (this.order.email !== '' && this.order.phone !== '') ? true : false;
	}
}
