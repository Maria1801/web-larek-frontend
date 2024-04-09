import {
	IProduct,
	IOrder,
	AddressForm,
	ContactsForm,
} from '../types';
import { IEvents } from './base/events';
import { Model } from './base/model';

export interface IAppDataManager {
	productList: IProduct[];
	basketList: IProduct[];
	setProductList(productList: IProduct[]): void;
	makeOrder(contactsForm: ContactsForm): IOrder;
	cleanOrder(): void;
}

export class AppDataManager extends Model<IAppDataManager> {
	productList: IProduct[];
	basketList: IProduct[];
	addressForm: AddressForm;

	constructor(events: IEvents) {
		super({
			productList: [],
			basketList: []
		}, events);
	}

	async setProductList(productList: IProduct[]) {
		this.productList = productList;
		this.emitChanges('productList:changed', { productList: this.productList });
	}

	makeOrder(contactsForm: ContactsForm): IOrder {
		var totalAmount = 0;
		this.basketList.map((product: IProduct) => {
			totalAmount += product.price;
		});
		const order = {
			payment: String(this.addressForm.payment),
			email: contactsForm.email,
			phone: contactsForm.telephone,
			address: this.addressForm.address,
			total: totalAmount,
			items: this.basketList.map((product: IProduct) => {
				return product.id;
			}),
		};

		this.addressForm = null;
		this.basketList = [];

		return order;
	}

	cleanOrder(): void {
		this.addressForm = null;
		this.basketList = [];
	}
}
