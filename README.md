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
- src/scss/styles.scss — корневой файл стилей
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

## Об архитектуре 

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, 
слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями
между этой передачей, и еще они меняют значения в моделях.
 

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

  - `baseUrl: string` - базовый URL API
  - `options: RequestInit` - опции для запроса

- Методы:
  - `handleResponse(response: Response)` - обрабатывает ответ от сервера
  - `get(uri: string)` - выполняет HTTP-запрос методом GET
  - `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - метод выполняет HTTP-запрос методом POST

### 3. Класс `Component<T>`

Абстрактный класс, принимает тип `T` данных описываемого компонента приложения. Сочетает в себе все основные методы для работы с DOM в дочерних компонентах.
Нужен для стандартизации работы с DOM и избежания дублирования логики.

- Методы:
  - `protected constructor(protected readonly container: HTMLElement)` - устанавливает значение container
  - `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключить класс
  - `protected setText(element: HTMLElement, value: unknown)` - Установить текстовое содержимое
  - `setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки
  - `protected setHidden(element: HTMLElement)` - Скрыть
  - `protected setVisible(element: HTMLElement)` - Показать
  - `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - Установить изображение с алтернативным текстом
  - `render(data?: Partial<T>): HTMLElement` - Вернуть корневой DOM-элемент


### 4. Класс `Model<T>`

Абстрактный класс, принимает тип `T` данных описываемой модели приложения. Базовая модель, чтобы можно было отличить ее от простых объектов с данными.

- Методы:
  - `constructor(data: Partial<T>, protected events: IEvents)` - устанавливает значение data
  - `emitChanges(event: string, payload?: object)` - Сообщить всем что модель поменялась


## Модель данных

### 1. Класс `AppDataManager`

Это класс наследник `Model<IAppDataManager>`, который содержит основные данные приложения: каталог и корзина, отвечает за изменений этих
данных. В нем всегда содержиться самая актуальная информация по данным, является первоисточником для всех остальных классов.

- Поля:
  - `productList: IProduct[]` - Массив товаров
  - `basketList: IProduct[]` - Массив товаров, добавленных в корзину
  - `addressForm: AddressForm` - Форма адреса

- Методы:

  - `constructor(events: IEvents)` - создает хранилище с пустыми данными
  - `setProductList(productList: IProduct[]): void` - Метод установки продуктов
  - `addBasketProduct(product: IProduct): void;` - добавление продукта в корзину
  - `removeBasketProduct(product: IProduct): void` - удаление продукта из корзины
  - `makeOrder(contactsForm: ContactsForm): IOrder` - Создает заказ на основе переданной формы контактов

### 2. Класс `LarekAPI`

Класс наследуется от `Api` и предоставляет методы для взаимодействия с конкретным сервером проекта.
Этот класс позволяет осуществлять взаимодействие с сервером, получать информацию о продуктах и отправлять заказы на сервер.
Конструктор принимает URL сервера для контента и опциональные настройки для запросов.

- Поля:
  - `baseUrl: string` - URL представляет базовый URL-адрес для API
- Методы:
  - `constructor(readonly baseUrl: string, options: RequestInit = {})` - вызывает конструктор родителя.
  - `productList(): Promise<ApiListResponse | void>` - возвращает список продуктов с сервера
  - `productItem(id: string): IProduct` - возвращает информацию о продукте с указанным идентификатором
  - `submitOrder(order: IOrder): Promise<ApiPostResponse | void>` - отправляет заказ на сервер и возвращает результат

## Классы представления

### 1. Класс `Card`

Класс наследник `Component<ICard>` представляет карточку товара, которая в зависимости от контейнера 
будет отображаться либо в каталоге на главной странице приложения, либо в корзине, либо в модальном окне подробной информации.

Данные для отображения:
```
export interface ICard {
	product: IProduct;
	handler: IClickHandler;
}
```

- Поля:
  - `private _price: HTMLElement` - DOM элемент цены карточки
  - `private _title: HTMLElement` - DOM элемент заголока карточки
  - `private _category: HTMLElement` - DOM элемент категории карточки
  - `private _img: HTMLImageElement` - DOM элемент картинки карточки
  - `private _btn: HTMLButtonElement` - DOM элемент кнопки карточки
  - `private _description: HTMLElement` - DOM элемент описания карточки
- Методы:
  - `constructor(container: HTMLElement)` - задает все DOM элементы карточки из контейнера
  - `set product(product: IProduct)` - устанавливает все значения элементов
  - `set handler(handler: IClickHandler)` - устанавливает addEventListener на кнопку

### 2. Класс `Basket`

Класс наследник `Component<IBasket>` представляет корзину товаров на странице и отвечает за отображение списка товаров в модальном окне корзины,
обновление общей цены.

Данные для отображения:
```
export interface IBasket {
	list: IProduct[];
}
```

- Поля:
  - `_list: HTMLElement` - DOM элемент списка корзины
  - `_price: HTMLElement` - DOM элемент для отображения общей стоимости товаров в корзине
  - `_button: HTMLButtonElement` - DOM элемент кнопки оформления заказа
- Методы:
  - `constructor(container: HTMLElement, protected events: EventEmitter)` - задает все DOM элементы корзины из контейнера, делает кнопку неактивной и устанавливает addEventListener 
  - `set list(productList: IProduct[])` - обновляет список товаров в корзине
  - `set price(productList: IProduct[])` - обновляет итоговую стоимость товаров в корзине

### 3. Класс `FormFinal`

Класс наследник `Component<IFormFinal>` представляет содержимое модального окна финальной формы заказа.

Данные для отображения:
```
export interface IFormFinal{
	total: number
}
```
- Поля:
  - `_close: HTMLElement` - DOM элемент кнопки закрытия
  - `_total: HTMLElement` - DOM элемент финальной стоимости товаров
- Методы:
  - `constructor(container: HTMLElement, onClick: IClickHandler)` - задает все DOM элементы финальной формы из контейнера и устанавливает addEventListener
  - `set total(value: number)` - обновляет финальную стоимость


### 4. Класс `MainPage`

Класс наследник `Component<IMainPage>` представляет содержимое главной страницы.

Данные для отображения:
```
export interface IMainPage {
	counter: number;
	catalog: IProduct[];
}
```

- Поля:
  - `_catalog: HTMLElement` - DOM элемент списка товаров
  - `_counter: HTMLElement` - DOM элемент счетка товаров карзины
- Методы:
  - `constructor(container: HTMLElement, protected events: IEvents)` - задает все DOM элементы страницы из контейнера и устанавливает addEventListener
  - `set catalog(productList: IProduct[])` - обновляет список товаров
  - `set counter(count: number)` - обновляет счетчик


## Общие классы представления

### 1. Класс `Modal`

Класс наследник `Component<IModal>` представляет контейнер модального окна, для того чтобы отображать в нем различное содержимое:
подробную информацию о карточке, корзину, форму заказа.

Данные для отображения:
```
export interface IModal {
	content: HTMLElement;
}
```

- Поля:
  - `closeBtn: HTMLButtonElement` -  DOM элемент кнопка закрытия модального окна.
  - `_content: HTMLElement` -  DOM элемент содержимое модального окна
- Методы:
  - `constructor(container: HTMLElement, protected events: IEvents)` - задает все DOM элементы страницы из контейнера и устанавливает addEventListener для кнопок закрытия
  - `set content(container: HTMLElement)` - устанавливает содержимое модального окна
  - `showModal()` - отображает модальное окно
  - `hideModal()` - скрывает модальное окно
  - `render(content: IModal)` - отображает модальное окно и возвращает контент


### 2. Класс `Form`

Класс наследник `Component<IForm>` представляет форму в приложении и обеспечивает взаимодействие с ней.

- Поля:
  - `error: HTMLElement` -  DOM элемент сообщения об ошибке
  - `isPaymentSelected: boolean` - выбран ли способ оплаты
  - `inputs: HTMLInputElement[]` - массив  DOM элементов инпутов формы
  - `paymentButtons: HTMLElement[]` -  DOM элементы кнопок выбора метода оплаты
  - `submit: HTMLButtonElement` -  DOM элемент кнопки подтверждения формы
  - `paymentMethod: PAYMENT_METHOD` - значение способа оплаты
- Методы:
  - `constructor(container: HTMLElement, protected events: IEvents)` - задает все DOM элементы формы из контейнера и устанавливает нужный addEventListener для кнопок, сбрасывает ошибки инпутов
  - `toggleSelected(button: HTMLElement)` - переключает выбранное состояние кнопки выбора способа оплаты
  - `updateValidation()` - обновляет состояние кнопки отправки формы в зависимости от заполнения формы и выбора способа оплаты
  - `showError(element: HTMLInputElement)` - показывает сообщение об ошибке для конкретного поля ввода
  - `cleanError():` - метод который очищает сообщение об ошибке


## События изменения внутреннего состояния

`productList:changed` - изменение списка продуктов: обновляем главную страницу.

`card:select` - выбор карточки для подробной информации: открываем модальное окно с карточкой.

`basket:render` - открыть корзину: открываем модальное окно с корзиной.

`basket:buy` - добавление товара в корзину: добавляем товар в хранилище и обновляем счетчик корзины.

`basket:delete` - удаление товара из корзины: удаляем товар из хранилища, обновляем счетчик корзины, обновляем модальное окно с корзиной.

`order:init` - инициализация покупки: открываем форму с адрессом.

`order:contacts` - следующий этап покупки: открываем форму с контактными данными.

`order:post` - финальный этап покупки: собираем все данные по заказу, отправляем их на сервер и открываем финальное модальное окно.


## Типы

```
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
	productItem(id: string): IProduct;
	submitOrder(order: IOrder): void;
}

export interface IProductAndClick {
	product: IProduct;
	onClick: IClickHandler;
}
```
