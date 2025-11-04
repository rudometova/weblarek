import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';
import { ProductList } from './components/models/ProductList';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { AppApi } from './components/api/AppApi';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview } from './components/views/card/CardPreview';
import { CartItem } from './components/views/card/CartItem';
import { BasketView } from './components/views/BasketView';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { SuccessView } from './components/views/SuccessView';
import { IProduct, IOrder, IOrderResponse } from './types';

// Инициализация EventEmitter
const events = new EventEmitter();

// Инициализация API
const api = new Api(API_URL);
const appApi = new AppApi(api);

// Инициализация моделей
const productsModel = new ProductList(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Инициализация View компонентов
const header = new Header(
    document.querySelector('.header') as HTMLElement,
    events
);

const gallery = new Gallery(
    document.querySelector('.gallery') as HTMLElement
);

const modal = new Modal(
    document.getElementById('modal-container') as HTMLElement,
    events
);

// Шаблоны
const cardCatalogTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// Создаем статические компоненты
const basketView = new BasketView(cloneTemplate(basketTemplate), {
    onClick: () => events.emit('order:open') 
});
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), {
    onClick: () => modal.close()
});


// Обработчики событий

// Обработчик изменения каталога
events.on('catalog:changed', () => {
    const items = productsModel.getItems().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({ ...item });
    });
    gallery.render({ catalog: items });
});

// Обработчик выбора карточки
events.on('card:select', (item: IProduct) => {
    productsModel.setSelectedItem(item);
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => events.emit('card:toggle', item)
    });
    
    const inBasket = cartModel.contains(item.id);
    const isAvailable = item.price !== null;
    
    card.render({  
        ...item,  
        inBasket,
        description: item.description,
        available: isAvailable 
    });
    
    modal.render({ content: card.render() });
});

// Обработчик добавления/удаления товара
events.on('card:toggle', (item: IProduct) => {
    if (cartModel.contains(item.id)) {
        cartModel.removeItem(item.id);
    } else {
        cartModel.addItem(item);
    }
    modal.close();
});

// Обработчик изменения корзины
events.on('cart:changed', () => {
    // Обновляем счетчик в хедере
    header.counter = cartModel.getCount();
    
    // Перерисовываем корзину
    const items = cartModel.getItems().map((item, index) => {
        const cartItem = new CartItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return cartItem.render({ ...item, index: index + 1 });
    });

    basketView.render({
        items,
        total: cartModel.getTotal(),
        selected: cartModel.getItems().map(item => item.id)
    });
});

// Обработчик открытия корзины
events.on('basket:open', () => {
    modal.render({ content: basketView.render() });
});

// Обработчик удаления товара из корзины
events.on('card:remove', (item: IProduct) => {
    cartModel.removeItem(item.id);
});

// Обработчик изменений в форме заказа
events.on('order:change', (data: { field: string; value: any }) => {
    // Сохраняем данные в модель
    buyerModel.setData({ [data.field]: data.value });
});

// Обработчик изменений данных покупателя
// Обработчик изменений данных покупателя - С ОТЛАДКОЙ
events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const validation = buyerModel.validate();
    
    const isOrderValid = !validation.payment && !validation.address;
    const isContactsValid = !validation.email && !validation.phone;
    
    // Обновляем форму заказа
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address || '',
        valid: isOrderValid,
        errors: [validation.payment, validation.address].filter(Boolean) as string[]
    });
    
    // Обновляем форму контактов
    contactsForm.render({
        email: buyerData.email || '',
        phone: buyerData.phone || '',
        valid: isContactsValid,
        errors: [validation.email, validation.phone].filter(Boolean) as string[]
    });
});



// Обработчик открытия формы заказа
events.on('order:open', () => {
    modal.render({ content: orderForm.render() });
});

// Обработчик отправки формы заказа
events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
});

// Обработчик изменений в форме контактов - С ОТЛАДКОЙ
events.on('contacts:change', (data: { field: string; value: any }) => {
    buyerModel.setData({ [data.field]: data.value });
});

// Обработчик отправки формы контактов
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const validation = buyerModel.validate();
    
    // Проверяем что нет ошибок валидации
    if (Object.keys(validation).length > 0) {
        console.error('Форма содержит ошибки:', validation);
        return;
    }

    // Используем оператор утверждения (!) так как проверили валидацию
    const orderData: IOrder = {
        payment: buyerData.payment!,
        email: buyerData.email!,
        phone: buyerData.phone!,
        address: buyerData.address!,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
    };

    appApi.createOrder(orderData)
        .then((response: IOrderResponse) => {
            // Берем сумму из ответа сервера
            successView.render({ total: response.total });
            modal.render({ content: successView.render() });

            // Очищаем корзину и данные покупателя
            cartModel.clear();
            buyerModel.clear();
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
        });
});

// Загрузка товаров
appApi.getProductList()
    .then(products => {
        productsModel.setItems(products);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });