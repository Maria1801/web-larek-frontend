import { AppDataManager } from './components/AppDataManager';
import { LarekApi } from './components/LarekAPI';
import { MainPage } from './components/MainPage';
import { Modal } from './components/common/Modal';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import {
	ApiListResponse,
	ApiPostResponse,
	IOrderForm,
	IProduct,
	PAYMENT_METHOD,
} from './types';
import { API_URL } from './utils/constants';
import { Basket } from './components/Basket';
import { Card } from './components/Card';
import { cloneTemplate } from './utils/utils';
import { Contacts } from './components/ContanctsForm';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/Success';

const modalContainer = document.getElementById(
	'modal-container'
) as HTMLElement;
const basketEl = cloneTemplate<HTMLTemplateElement>('#basket');
const orderFormEl = cloneTemplate<HTMLFormElement>('#order');
const contactsFormEl = cloneTemplate<HTMLFormElement>('#contacts');
const successEl = cloneTemplate<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const larekApi = new LarekApi(API_URL);

const page = new MainPage(document.body, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(basketEl, events);
const formAddress = new OrderForm(orderFormEl, events);
const formContacts = new Contacts(contactsFormEl, events);
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
			isAlreadyInBasket: appDataManager.isProductInBasket(product),
			isNullPrice: product.price==null,
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
		content: formAddress.render({
			payment: '',
			address: '',
			valid: false,
			errors: ['Выберете способ оплаты и адресс']
		}),
	});
});

events.on('payment:change', (item: HTMLButtonElement) => {
	if (item.name === 'cash') {
		appDataManager.order.payment = PAYMENT_METHOD.RECEIVED;
	} else if (item.name === 'card') {
		appDataManager.order.payment = PAYMENT_METHOD.ONLINE;
	}
	formAddress.checkErrors(appDataManager.order);
	formAddress.valid = appDataManager.isValidContactsForm();
})

events.on('order.address:change', (data: { field: keyof IOrderForm, value: string }) => {
    appDataManager.order.address = data.value;
	formAddress.checkErrors(appDataManager.order);
	formAddress.valid = appDataManager.isValidContactsForm();
  });


events.on('order:submit', () => {
    modal.render({
      content: formContacts.render({
        email: '',
        phone: '',
        valid: false,
        errors: ['Введите email и телефон']
      })
    });
})

events.on('contacts.email:change', (data: { field: keyof IOrderForm, value: string }) => {
    appDataManager.order.email = data.value;
	formContacts.checkErrors(appDataManager.order);
	formContacts.valid = appDataManager.isValidAddressForm();
});

events.on('contacts.phone:change', (data: { field: keyof IOrderForm, value: string }) => {
    appDataManager.order.phone = data.value;
	formContacts.checkErrors(appDataManager.order);
	formContacts.valid = appDataManager.isValidAddressForm();
});

events.on('contacts:submit', () => {
	const order = appDataManager.makeOrder();
	const success = new Success(successEl, {
		onClick: () => {
			modal.hideModal();
		},
	});

	modal.render({
		content: success.render({
			total: String(order.total + ' синапсов')
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
					total: String(response.total + ' синапсов'),
				}),
			});
		})
		.catch((err) => {
			console.error(err);
			modal.render({
				content: success.render({
					total: 'Что-то пошло не так',
				}),
			});
		});
});

events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

larekApi
	.productList()
	.then((res: ApiListResponse) => appDataManager.setProductList(res.items))
	.catch((err) => {
		console.error(err);
	});
