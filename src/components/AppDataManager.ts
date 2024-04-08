import {
	IProduct,
	IOrder,
	IAppData,
	AddressForm,
	ContactsForm,
	IAppDataManager,
} from '../types';
import { IEvents } from './base/events';

export class AppDataManager implements IAppDataManager, IAppData {
	productList: IProduct[];
	basketList: IProduct[];
	addressForm: AddressForm;

	constructor(protected events: IEvents) {
		this.productList = [];
		this.basketList = [];
	}

	async setProductList(productList: IProduct[]) {
		this.productList = productList;
		this.events.emit('productList:changed', { productList: this.productList });
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
