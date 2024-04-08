# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код

### 1. Класс `EventEmitter`

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков
о наступлении события.
Класс имеет методы `on` , `off` , `emit` — для подписки на событие, отписки от события и уведомления
подписчиков о наступлении события соответственно.
Дополнительно реализованы методы `onAll` и `offAll` — для подписки на все события и сброса всех
подписчиков.
Интересным дополнением является метод `trigger` , генерирующий заданное событие с заданными
аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти
классы будут генерировать события, не будучи при этом напрямую зависимыми от
класса EventEmitter .

### 2. Класс `Api`

Этот класс предоставляет базовые методы для выполнения HTTP-запросов к внешнему API

- Поля:

  - `baseUrl` - базовый URL API
  - `options` - опции для запроса

- Методы:
  - `handleResponse(response: Response)` - обрабатывает ответ от сервера
  - `get(uri: string)` - выполняет HTTP-запрос методом GET
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - метод выполняет HTTP-запрос методом POST

## Модель данных

### 1. Класс `AppDataManager`

Это класс, который содержит логику управления данными приложения.

- Методы:

  - `setProductList` - Метод установки продуктов
  - `makeOrder` - Создает заказ на основе переданной формы контактов
  - `cleanOrder` - Очищает данные заказа

- Поля:
  - `productList` - Массив товаров
  - `basketList` - Массив товаров, добавленных в корзину
  - `addressForm` - Форма адреса

### 2. Класс `LarekAPI`

Класс расширяет базовый класс Api и предоставляет методы для взаимодействия с конкретным сервером проекта.
Этот класс позволяет осуществлять взаимодействие с сервером, получать информацию о продуктах и отправлять заказы на сервер.
Конструктор принимает URL сервера для контента и опциональные настройки для запросов.

- Поля:
  - `baseUrl` - URL представляет базовый URL-адрес для API
- Методы:
  - `productList` - возвращает список продуктов с сервера
  - `productItem` - возвращает информацию о продукте с указанным идентификатором
  - `submitOrder` - отправляет заказ на сервер и возвращает результат

### 3. Класс `MainPage`

Класс MainPage представляет главную страницу приложения и управляет отображением каталога товаров и корзины.

- Поля:
  - `_catalog` - представляет элемент DOM каталога товаров
  - `_basket` - представляет элемент DOM корзины товаров
- Методы:
  - `set catalog(products: IProductAndClick[])` - Этот метод устанавливает каталог товаров на основе переданного массива

## Классы представления

### 1. Класс `Card`

Этот класс представляет карточку товара, которая будет отображаться в каталоге на главной странице приложения.

- Поля:
  - `product` - продукт карточки
  - `container` - представляет элемент контейнера (HTML-элемент), в который будет вставлена карточка товара.
- Методы:
  - `render` - возвращает HTML-элемент, который представляет карточку товара. Он используется, чтобы получить элемент карточки и добавить его в DOM для отображения на странице.

### 2. Класс `Modal`

Класс предназначен для управления модальным окном.

- Поля:
  - `closeBtn` - кнопка закрытия модального окна.
  - `_content` - контейнер, в котором будет отображаться содержимое модального окна
- Методы:
  - `renderSelectedProduct(productAndClick: IProductAndClick)` - отображает выбранный продукт в модальном окне
  - `renderContainer(container: HTMLElement)` - отображает контент переданный в аргументе
  - `showModal` - отображает модальное окно
  - `hideModal` - скрывает модальное окно

### 3. Класс `Basket`

Этот класс представляет корзину товаров на странице и отвечает за отображение списка товаров в корзине, обновление общей цены и счетчика товаров в корзине.

- Поля:
  - `_counter ` - DOM элемент количества товаров в корзине
  - `_list` - DOM элемент списка корзины
  - `_price ` - DOM элемент для отображения общей стоимости товаров в корзине
  - `_button ` - кнопка оформления заказа
  - `container` - контейнер (HTML-элемент), в который будет помещена корзина.
- Методы:
  - `renderCounter(amount: number) ` - отображает количество товаров в корзине
  - `updateList(productList: IProduct[]) ` - обновляет список товаров в корзине

### 4. Класс `Form`

Класс представляет форму в приложении и обеспечивает взаимодействие с ней.

- Поля:
  - `error` - сообщение об ошибке
  - `container` - элемент контейнера формы
  - `_button`, `_actions`, `_inputs`, `_paymentButton`, `_submit` - различные элементы формы
  - `isPaymentSelected` - указывает, выбран ли метод оплаты.
- Методы:
  - `toggleSelected(button: HTMLElement)` - переключает выбранное состояние кнопки выбора способа оплаты
  - `updateValidation()` - обновляет состояние кнопки отправки формы в зависимости от заполнения формы и выбора способа оплаты
  - `showError(element: HTMLInputElement)` - показывает сообщение об ошибке для конкретного поля ввода
  - `cleanError():` - который очищает сообщение об ошибке
  - `render():` - возвращает контейнер

## Типы

```
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
    updateForm(): void;
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
    payment: PAYMENT_METHOD,
    address: string,
}

export interface ContactsForm {
    email: string,
    telephone: string,
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
	product: IProduct,
	onClick: IClickHandler,
};
```
