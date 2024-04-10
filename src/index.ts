import { AppDataManager } from './components/AppDataManager';
import { LarekApi } from './components/LarekAPI';
import { MainPage } from './components/MainPage';
import { Modal } from './components/common/Modal';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import {
	AddressForm,
	ApiListResponse,
	ApiPostResponse,
	ContactsForm,
	IProduct,
} from './types';
import { API_URL } from './utils/constants';
import { Basket } from './components/Basket';
import { Form } from './components/common/Form';
import { FormFinal } from './components/FormFinal';
import { Card } from './components/Card';
import { cloneTemplate } from './utils/utils';

const modalContainer = document.getElementById(
	'modal-container'
) as HTMLElement;
const basketEl = cloneTemplate<HTMLTemplateElement>('#basket');
const orderEl = cloneTemplate<HTMLTemplateElement>('#order');
const contactsEl = cloneTemplate<HTMLTemplateElement>('#contacts');
const successEl = cloneTemplate<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL);

const page = new MainPage(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketEl, events);
const formAddress = new Form(orderEl, events);
const formContacts = new Form(contactsEl, events);
const appDataManager = new AppDataManager(events);

events.on('productList:changed', () => {
	page.render({
		counter: appDataManager.basketList.length,
		catalog: appDataManager.productList,
	});
});

events.on('card:select', (product: IProduct) => {
	const selectedCard = new Card(
		cloneTemplate<HTMLTemplateElement>('#card-preview')
	);
	modal.render({
		content: selectedCard.render({
			product: product,
			handler: {
				onClick: () => {
					modal.hideModal();
					events.emit('basket:buy', product);
				},
			},
		}),
	});
});

events.on('basket:render', () => {
	modal.render({
		content: basket.render({
			list: appDataManager.basketList,
		}),
	});
});

events.on('basket:buy', (product: IProduct) => {
	appDataManager.addBasketProduct(product);
	page.render({
		counter: appDataManager.basketList.length,
	});
});

events.on('basket:delete', (product: IProduct) => {
	appDataManager.removeBasketProduct(product);
	page.render({
		counter: appDataManager.basketList.length,
	});
	modal.render({
		content: basket.render({
			list: appDataManager.basketList,
		}),
	});
});

events.on('order:init', () => {
	modal.render({
		content: formAddress.render(),
	});
});

events.on('order:contacts', (values: AddressForm) => {
	appDataManager.addressForm = values;
	modal.render({
		content: formContacts.render(),
	});
});

events.on('order:post', (values: ContactsForm) => {
	const order = appDataManager.makeOrder(values);
	const success = new FormFinal(successEl, {
		onClick: () => {
			modal.hideModal();

		},
	});

	modal.render({
		content: success.render({
			total: order.total,
		}),
	});
	page.render({
		counter: appDataManager.basketList.length,
	});

	larekApi
		.submitOrder(order)
		.then((response: ApiPostResponse) => {
			modal.render({
				content: success.render({
					total: response.total,
				}),
			});
		})
		.catch((err) => {
			console.error(err);
			modal.render({
				content: success.render({
					total: 0,
				}),
			});
		});
});

larekApi
	.productList()
	.then((res: ApiListResponse) => appDataManager.setProductList(res.items))
	.catch((err) => {
		console.error(err);
	});
