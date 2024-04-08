import { AppDataManager } from './components/AppDataManager';
import { LarekApi } from './components/LarekAPI';
import { MainPage } from './components/MainPage';
import { Modal } from './components/Modal';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { AddressForm, ApiListResponse, ContactsForm, IProduct } from './types';
import { API_URL } from './utils/constants';
import { Basket } from './components/Basket';
import { Form } from './components/Form';
import { copyTemplate } from './utils/utils';

const modalContainer = document.getElementById(
	'modal-container'
) as HTMLElement;
const basketEl = copyTemplate('basket');
const orderEl = copyTemplate('order');
const contactsEl = copyTemplate('contacts');

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL);

const page = new MainPage(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketEl, events);
const formAddress = new Form(orderEl, events);
const formContacts = new Form(contactsEl, events);
const appDataManager = new AppDataManager(events);

events.on('productList:changed', () => {
	page.catalog = appDataManager.productList.map((_product) => {
		return {
			product: _product,
			onClick: {
				onClick: () => events.emit('card:select', _product),
			},
		};
	});
});

events.on('card:select', (product: IProduct) => {
	modal.renderSelectedProduct({
		product: product,
		onClick: {
			onClick: () => {
				modal.hideModal();
				events.emit('basket:buy', product);
			},
		},
	});
});

events.on('basket:render', () => {
	modal.renderContainer(basket.container);
});

events.on('basket:buy', (product: IProduct) => {
	appDataManager.basketList.push(product);
	basket.renderCounter(appDataManager.basketList.length);
	basket.updateList(appDataManager.basketList);
});

events.on('basket:delete', (product: IProduct) => {
	const index = appDataManager.basketList.indexOf(product, 0);
	if (index > -1) {
		appDataManager.basketList.splice(index, 1);
	}
	basket.renderCounter(appDataManager.basketList.length);
	basket.updateList(appDataManager.basketList);
});

events.on('order:init', () => {
	modal.renderContainer(formAddress.render());
});

events.on('order:contacts', (values: AddressForm) => {
	appDataManager.addressForm = values;
	modal.renderContainer(formContacts.render());
});

events.on('order:post', (values: ContactsForm) => {
	const order = appDataManager.makeOrder(values);
});

larekApi
	.productList()
	.then((res: ApiListResponse) => appDataManager.setProductList(res.items))
	.catch((err) => {
		console.error(err);
	});
