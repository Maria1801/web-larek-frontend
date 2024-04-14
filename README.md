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
- `constructor(baseUrl: string, options: RequestInit = {})` Конструктор класса, принимающий базовый URL baseUrl и опции options для запросов. Устанавливает переданные значения в соответствующие поля класса.

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
- `protected constructor(protected readonly container: HTMLElement)` -  Конструктор класса, принимающий контейнер (родительский элемент) для размещения компонента. Устанавливает переданный контейнер в свойство container.
- Методы:
  - `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключить класс
  - `protected setText(element: HTMLElement, value: unknown)` - Установить текстовое содержимое
  - `setDisabled(element: HTMLElement, state: boolean)` - Сменить статус блокировки
  - `protected setHidden(element: HTMLElement)` - Скрыть
  - `protected setVisible(element: HTMLElement)` - Показать
  - `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - Установить изображение с алтернативным текстом
  - `render(data?: Partial<T>): HTMLElement` - Вернуть корневой DOM-элемент


### 4. Класс `Model<T>`

Абстрактный класс, принимает тип `T` данных описываемой модели приложения. Базовая модель, чтобы можно было отличить ее от простых объектов с данными.
- `constructor(data: Partial<T>, protected events: IEvents)` - Конструктор принимает два параметра: data - частичные данные типа T, которые будут присвоены модели при создании, и events - объект типа IEvents, используемый для управления событиями.
- Методы:
  - `emitChanges(event: string, payload?: object)` - Сообщить всем что модель поменялась


## Модель данных

### 1. Класс `AppDataManager`

Это класс наследник `Model<IAppDataManager>`, который содержит основные данные приложения: каталог и корзина, отвечает за изменений этих
данных. В нем всегда содержиться самая актуальная информация по данным, является первоисточником для всех остальных классов.
- `constructor(events: IEvents)` -
  Конструктор класса AppDataManager выполняет инициализацию объекта этого класса. Он принимает один аргумент `events`, который представляет собой интерфейс для управления событиями в приложении. Внутри конструктора устанавливаются начальные значения для полей `productList`, `basketList`, `order` и `formErrors`.
- Поля:
  - `productList: IProduct[]` - Массив товаров
  - `basketList: IProduct[]` - Массив товаров, добавленных в корзину
  - `	order: IOrder = {
    payment: '',
    email: '',
    phone: '',
    address: '',
    total: 0,
    items: []
    };` - Объект, содержащий информацию о заказе, включая метод оплаты, email, телефон, адрес доставки, общую стоимость заказа и список товаров
  - `formErrors: FormErrors = {}` - Объект, содержащий информацию об ошибках ввода в форме.

- Методы:
  - `setProductList(productList: IProduct[]): void` - Метод установки продуктов
  - `isProductInBasket(product: IProduct): boolean;` - проверяет продукт в корзине или нет
  - `addBasketProduct(product: IProduct): void;` - добавление продукта в корзину
  - `removeBasketProduct(product: IProduct): void` - удаление продукта из корзины
  - `makeOrder(): IOrder` - Создает заказ и возвращает его
  - `isValidContactsForm(): boolean` - Проверяет, является ли форма контактных данных для заказа допустимой
  - `isValidAddressForm(): boolean` -  Проверяет, является ли форма адреса для заказа допустимой
  

### 2. Класс `LarekAPI`

Класс наследуется от `Api` и предоставляет методы для взаимодействия с конкретным сервером проекта.
Этот класс позволяет осуществлять взаимодействие с сервером, получать информацию о продуктах и отправлять заказы на сервер.
- `constructor(readonly baseUrl: string, options: RequestInit = {})` - Конструктор класса, принимающий базовый URL API (baseUrl) и дополнительные опции запроса (options). Устанавливает эти значения в соответствующие поля объекта. Вызывает конструктор родительского класса Api, передавая ему baseUrl и options.
- Поля:
  - `baseUrl: string` - URL представляет базовый URL-адрес для API
  - `options: RequestInit = {}` - объект типа RequestInit, содержащий дополнительные опции запроса.
- Методы:
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
	isAlreadyInBasket: boolean;
  isNullPrice: boolean;
	index: number;
}
```
- `constructor(container: HTMLElement)` - Конструктор класса, принимающий контейнер (родительский элемент) для создания карточки продукта. Вызывает конструктор родительского класса Component и инициализирует поля класса, находя соответствующие элементы внутри контейнера.

- Поля:
  - `private _price: HTMLElement` - DOM элемент цены карточки
  - `private _title: HTMLElement` - DOM элемент заголока карточки
  - `private _category: HTMLElement` - DOM элемент категории карточки
  - `private _img: HTMLImageElement` - DOM элемент картинки карточки
  - `private _btn: HTMLButtonElement` - DOM элемент кнопки карточки
  - `private _description: HTMLElement` - DOM элемент описания карточки
  - `private _index: HTMLElement` - DOM элемент индекса карточки в корзине
- Методы:
  - `set product(product: IProduct)` - устанавливает все значения элементов
  - `set handler(handler: IClickHandler)` - устанавливает addEventListener на кнопку
  - `set isAlreadyInBasket(flag: boolean)` - делает кнопку неактивной и устанавливает текст "Уже в корзине"
  - `set index(i: number)` - устанавливает значение индекса в корзине
  - `set isNullPrice(flag: boolean)` - делает кнопку неактивной и устанавливает текст "Нельзя купить"


### 2. Класс `Basket`

Класс наследник `Component<IBasket>` представляет корзину товаров на странице и отвечает за отображение списка товаров в модальном окне корзины,
обновление общей цены.

Данные для отображения:
```
export interface IBasket {
	list: IProduct[];
}
```
- `constructor(container: HTMLElement, protected events: EventEmitter)` - Конструктор класса, принимающий контейнер (родительский элемент) для создания корзины и объект events типа EventEmitter для работы с событиями. Вызывает конструктор родительского класса Component и инициализирует поля класса, находя соответствующие элементы внутри контейнера. Добавляет слушатель события клика на кнопку для инициирования оформления заказа.
- Поля:
  - `_list: HTMLElement` - DOM элемент списка корзины
  - `_price: HTMLElement` - DOM элемент для отображения общей стоимости товаров в корзине
  - `_button: HTMLButtonElement` - DOM элемент кнопки оформления заказа
- Методы:
  - `set list(productList: IProduct[])` - обновляет список товаров в корзине
  - `set price(productList: IProduct[])` - обновляет итоговую стоимость товаров в корзине

### 3. Класс `MainPage`

Класс наследник `Component<IMainPage>` представляет содержимое главной страницы.

Данные для отображения:
```
export interface IMainPage {
	counter: number;
	catalog: IProduct[];
}
```
- `constructor(container: HTMLElement, protected events: IEvents)` - Конструктор класса, принимающий контейнер (родительский элемент) для создания главной страницы и объект events типа IEvents для работы с событиями. Вызывает конструктор родительского класса Component и инициализирует поля класса, находя соответствующие элементы внутри контейнера. Добавляет слушатель события клика на корзину для отображения содержимого корзины.
- Поля:
  - `_catalog: HTMLElement` - DOM элемент списка товаров
  - `_counter: HTMLElement` - DOM элемент счетка товаров карзины
  - `_wrapper: HTMLElement` - DOM элемент для блокировки модального окна
- Методы:
  - `set catalog(productList: IProduct[])` - обновляет список товаров
  - `set counter(count: number)` - обновляет счетчик
  - `set locked(value: boolean)` - блокирует прокрутку для модального окна

### 4. Класс `ContactsForm`
Класс  представляет собой форму для ввода контактной информации, наследуемую от класса Form.
Данные для отображения:
```
export interface IContactsForm {
    phone?: string;
    email?: string;
}
```
- `constructor(container: HTMLFormElement, protected events: IEvents)` - Принимает контейнер формы (container) и объект событий (events). Вызывает конструктор родительского класса Form, передавая ему эти аргументы.
- Сеттеры `phone(value: string)` и `email(value: string)`: Позволяют устанавливать значения для соответствующих полей формы "телефон" и "email". Они используют метод namedItem для получения элемента формы по его имени и устанавливают значение введенного текста.
 
- Методы:
  - ` checkErrors(order: IOrder)` - Проверяет наличие ошибок в заполнении формы


### 5. Класс `OrderForm`
Класс OrderForm представляет форму заказа, наследуя функциональность базового класса Form
Данные для отображения:
```
export interface AddressForm {
	payment: string;
	address: string;
}
```
- `constructor(container: HTMLFormElement, protected events: IEvents)` - Конструктор принимает контейнер формы и объект событий. Он вызывает конструктор родительского класса Form, передавая ему эти аргументы.

- Методы:
  - ` payment(name: string))` - устанавливает выбранный способ оплаты путем добавления или удаления
  - ` address(value: string)` - устанавливает адресс
  - ` checkErrors(order: IOrder))` - Проверяет наличие ошибок в заполнении формы

### 6. Класс `Success` 
Класс наследник Component представляет содержимое модального окна финальной формы заказа.
```
interface ISuccess {
	total: string;
}
```
- `constructor(container: HTMLElement, actions: IClickHandler)` - задает все DOM элементы финальной формы из контейнера и устанавливает addEventListener
- Поля:
- `_close: HTMLElement` - DOM элемент кнопки закрытия
- `_total: HTMLElement` - DOM элемент финальной стоимости товаров
- Методы:
  - `set total(value: number)` - обновляет финальную стоимость

  
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
- `constructor(container: HTMLElement, protected events: IEvents)` - Конструктор класса, принимающий контейнер (родительский элемент) для создания модального окна и объект events типа IEvents для работы с событиями. Вызывает конструктор родительского класса Component и инициализирует поля класса, находя соответствующие элементы внутри контейнера. Устанавливает обработчики событий для кнопки закрытия модального окна и для области вне контента модального окна.
- Поля:
  - `closeBtn: HTMLButtonElement` -  DOM элемент кнопка закрытия модального окна.
  - `_content: HTMLElement` -  DOM элемент содержимое модального окна
- Методы:
  - `set content(container: HTMLElement)` - устанавливает содержимое модального окна
  - `showModal()` - отображает модальное окно
  - `hideModal()` - скрывает модальное окно
  - `render(content: IModal)` - отображает модальное окно и возвращает контент


### 2. Класс `Form`

Класс наследник `Component<IForm>` представляет форму в приложении и обеспечивает взаимодействие с ней.
- `constructor(container: HTMLElement, protected events: IEvents)` - Конструктор класса, принимающий контейнер формы (container) и объект events типа IEvents для работы с событиями. Вызывает конструктор родительского класса Component и инициализирует поля класса, находя соответствующие элементы внутри контейнера формы. Добавляет обработчики событий для изменения значений в полях формы (input) и отправки формы (submit).

- Поля:
  - ` _submit: HTMLButtonElement` - кнопка отправки формы
  - ` _errors: HTMLElement` - контейнер для вывода ошибок в форме
- Методы:
  - `onInputChange(field: keyof T, value: string)` - Метод для обработки события изменения значения в полях формы
  - `set valid(value: boolean)` -Метод для установки состояния доступности кнопки отправки формы
  - `set errors(value: string)` - Метод для установки сообщения об ошибке в форме.
  - `render(state: Partial<T> & IFormState)` - Метод для рендеринга формы с заданным состоянием


## События изменения внутреннего состояния

`productList:changed` - изменение списка продуктов: обновляем главную страницу.

`card:select` - выбор карточки для подробной информации: открываем модальное окно с карточкой.

`basket:render` - открыть корзину: открываем модальное окно с корзиной.

`basket:buy` - добавление товара в корзину: добавляем товар в хранилище и обновляем счетчик корзины.

`basket:delete` - удаление товара из корзины: удаляем товар из хранилища, обновляем счетчик корзины, обновляем модальное окно с корзиной.

`order:init` - инициализация покупки: открываем форму с адрессом.

`order:contacts` - следующий этап покупки: открываем форму с контактными данными.

`order:post` - финальный этап покупки: собираем все данные по заказу, отправляем их на сервер и открываем финальное модальное окно.

`modal:open` - открыть модальное окно и заблокировать прокрутку страницы

`modal:close` - закрыть модальное окно и раззаблокировать прокрутку страницы


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
