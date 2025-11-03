# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/models/ — папка с моделями данных
- src/components/views/ — папка с компонентами представления
- src/components/api/ — папка с API классами

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды
npm install
npm run dev

## Сборка
npm run build

# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Данные
### Интерфейсы данных
**IProduct** - описывает структуру товара:
id: string - уникальный идентификатор
title: string - название товара
description: string - описание товара
image: string - URL изображения
category: string - категория товара
price: number | null - цена товара (может быть null)
**IBuyer** - описывает данные покупателя:
payment: TPayment - способ оплаты ('card' или 'cash')
email: string - email покупателя
phone: string - телефон покупателя
address: string - адрес доставки
**IOrder** - описывает данные заказа:
payment: TPayment - способ оплаты
email: string - email покупателя
phone: string - телефон покупателя
address: string - адрес доставки
total: number - общая стоимость заказа
items: string[] - массив ID товаров
**IValidationErrors** - описывает ошибки валидации:
payment?: string - ошибка способа оплаты
email?: string - ошибка email
phone?: string - ошибка телефона
address?: string - ошибка адреса

### Модели данных
## Класс ProductList
Назначение: Хранит каталог товаров и выбранный товар для детального просмотра.

Конструктор:
typescript
constructor()

Поля:
_items: IProduct[] - массив всех товаров
_selectedItem: IProduct | null - выбранный для просмотра товар

Методы:
setItems(items: IProduct[]): void - сохраняет массив товаров
getItems(): IProduct[] - возвращает массив всех товаров
getItem(id: string): IProduct | undefined - возвращает товар по ID
setSelectedItem(item: IProduct): void - сохраняет выбранный товар
getSelectedItem(): IProduct | null - возвращает выбранный товар

## Класс Cart
Назначение: Управляет товарами в корзине покупок.

Конструктор:
typescript
constructor()

Поля:
_items: IProduct[] - массив товаров в корзине

Методы:
getItems(): IProduct[] - возвращает товары в корзине
addItem(item: IProduct): void - добавляет товар в корзину
removeItem(id: string): void - удаляет товар из корзины по ID
clear(): void - очищает корзину
getTotal(): number - возвращает общую стоимость товаров
getCount(): number - возвращает количество товаров в корзине
contains(id: string): boolean - проверяет наличие товара в корзине

## Класс Buyer
Назначение: Хранит и валидирует данные покупателя.

Конструктор:
typescript
constructor(protected events: IEvents)

Поля:
_data: Partial<IBuyer> - данные покупателя

Методы:
setData(data: Partial<IBuyer>): void - сохраняет данные покупателя
getData(): Partial<IBuyer> - возвращает все данные покупателя
clear(): void - очищает данные покупателя
validate(): IValidationErrors - валидирует данные и возвращает ошибки

### Слой коммуникации
Класс AppApi
Назначение: Обеспечивает взаимодействие с API сервера.

Конструктор:
typescript
constructor(baseApi: IApi)

Поля:
_baseApi: IApi - экземпляр базового API класса

Методы:
getProductList(): Promise<IProduct[]> - получает список товаров с сервера
createOrder(order: IOrder): Promise<IOrderResponse> - отправляет заказ на сервер


### Слой представления (View)

## Класс Card (базовый)
Назначение: Базовый класс для всех карточек товара.

Конструктор:
typescript
constructor(container: HTMLElement)

Поля:
_title: HTMLElement - элемент названия товара
_price: HTMLElement - элемент цены товара
_category: HTMLElement | null - элемент категории товара
_image: HTMLImageElement | null - элемент изображения товара

Методы:
set title(value: string) - устанавливает название товара
set price(value: number | null) - устанавливает цену товара
set category(value: string) - устанавливает категорию товара и применяет CSS класс
set image(value: string) - устанавливает изображение товара

## Класс Form (базовый)
Назначение: Базовый класс для всех форм.

Конструктор:
typescript
constructor(container: HTMLFormElement)

Поля:
_submit: HTMLButtonElement | null - кнопка отправки формы
_errors: HTMLElement | null - элемент для отображения ошибок

Методы:
set valid(value: boolean) - активирует/деактивирует кнопку отправки
set errors(value: string[]) - отображает ошибки валидации

## Класс Header
Назначение: Отображает шапку сайта с корзиной и счетчиком товаров.

Конструктор:
typescript
constructor(container: HTMLElement, protected events: IEvents)

Поля:
_counter: HTMLElement - элемент счетчика товаров
_basket: HTMLButtonElement - кнопка корзины

Методы:
set counter(value: number) - обновляет значение счетчика

## Класс Gallery
Назначение: Контейнер для отображения каталога товаров.

Конструктор:
typescript
constructor(container: HTMLElement)

Поля:
_catalog: HTMLElement - контейнер для карточек товаров

Методы:
set catalog(items: HTMLElement[]) - отображает массив карточек товаров

## Класс Modal
Назначение: Управляет модальными окнами.

Конструктор:
typescript
constructor(container: HTMLElement, protected events: IEvents)

Поля:
_closeButton: HTMLButtonElement - кнопка закрытия
_content: HTMLElement - контейнер для контента

Методы:
set content(value: HTMLElement | null) - устанавливает контент модального окна
open(): void - открывает модальное окно
close(): void - закрывает модальное окно

## Класс CardCatalog
Назначение: Карточка товара в каталоге.
Наследует от: Card<ICardCatalog>

Конструктор:
typescript
constructor(container: HTMLElement, actions?: { onClick: () => void })

Методы:
set price(value: number | null) - блокирует карточку если товар недоступен

## Класс CardPreview
Назначение: Карточка товара в модальном окне просмотра.
Наследует от: Card<ICardPreview>

Конструктор:
typescript
constructor(container: HTMLElement, actions?: { onClick: () => void })

Поля:
_description: HTMLElement - элемент описания товара
_button: HTMLButtonElement - кнопка действия

Методы:
set description(value: string) - устанавливает описание товара
set inBasket(value: boolean) - меняет текст кнопки в зависимости от статуса корзины
set price(value: number | null) - блокирует кнопку если товар недоступен

## Класс CartItem
Назначение: Карточка товара в корзине.
Наследует от: Card<ICartItem>

Конструктор:
typescript
constructor(container: HTMLElement, actions?: { onClick: () => void })

Поля:
_index: HTMLElement - элемент номера позиции
_deleteButton: HTMLButtonElement - кнопка удаления

Методы:
set index(value: number) - устанавливает номер позиции в корзине

## Класс OrderForm
Назначение: Форма оформления заказа (первый шаг).
Наследует от: Form<IOrderFormData>

Конструктор:
typescript
constructor(container: HTMLFormElement, actions?: { onChange: () => void })

Поля:
_paymentButtons: HTMLButtonElement[] - кнопки выбора способа оплаты
_addressInput: HTMLInputElement - поле ввода адреса

Методы:
selectPayment(method: 'card' | 'cash') - выбирает способ оплаты
set payment(value: 'card' | 'cash' | undefined) - устанавливает способ оплаты
set address(value: string) - устанавливает адрес доставки

## Класс ContactsForm
Назначение: Форма контактов (второй шаг).
Наследует от: Form<IContactsFormData>

Конструктор:
typescript
constructor(container: HTMLFormElement, actions?: { onChange: () => void })

Поля:
_emailInput: HTMLInputElement - поле ввода email
_phoneInput: HTMLInputElement - поле ввода телефона

Методы:
set email(value: string) - устанавливает email
set phone(value: string) - устанавливает телефон


## Класс BasketView
Назначение: Отображает содержимое корзины.

Конструктор:
typescript
constructor(container: HTMLElement, actions?: { onClick: () => void })

Поля:
_list: HTMLElement - список товаров в корзине
_total: HTMLElement - элемент общей стоимости
_button: HTMLButtonElement - кнопка оформления заказа

Методы:
set items(value: HTMLElement[]) - отображает список товаров
set total(value: number) - устанавливает общую стоимость
set selected(value: string[]) - активирует/деактивирует кнопку оформления

## Класс SuccessView
Назначение: Отображает успешное оформление заказа.

Конструктор:
typescript
constructor(container: HTMLElement, actions?: { onClick: () => void })

Поля:
_total: HTMLElement - элемент суммы заказа
_button: HTMLButtonElement - кнопка закрытия

Методы:
set total(value: number) - устанавливает сумму заказа

## События моделей
'catalog:changed' - изменение каталога товаров
'product:selected' - выбор товара для просмотра
'cart:changed' - изменение содержимого корзины
'buyer:changed' - изменение данных покупателя

## События представлений
'card:select' - выбор карточки для просмотра
'card:toggle' - нажатие кнопки покупки/удаления товара
'card:remove' - нажатие кнопки удаления товара из корзины
'basket:open' - нажатие кнопки открытия корзины
'order:open' - нажатие кнопки оформления заказа
'order:change' - изменение данных в форме заказа
'order:submit' - отправка формы заказа
'contacts:change' - изменение данных в форме контактов
'contacts:submit' - отправка формы контактов
'modal:open' - открытие модального окна
'modal:close' - закрытие модального окна

### Презентер
Реализация: Код презентера расположен в основном скрипте приложения src/main.ts
Назначение: Координирует взаимодействие между моделями и представлениями, обрабатывает события и содержит основную бизнес-логику приложения.

Основные функции:
Инициализация всех компонентов приложения
Обработка событий от моделей и представлений
Связывание данных между слоями
Управление потоком данных и состоянием приложения
Обработка пользовательских действий и обновление интерфейса

Ключевые обработчики:
Загрузка и отображение каталога товаров
Управление модальными окнами
Работа с корзиной покупок
Валидация и обработка форм заказа
Отправка заказа на сервер
Презентер обеспечивает соблюдение паттерна MVP, где модели отвечают только за данные, представления - только за отображение, а вся бизнес-логика сосредоточена в презентере.