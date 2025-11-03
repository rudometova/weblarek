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
import { IProduct, IOrder } from './types';

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
    card.render({ 
        ...item, 
        inBasket,
        description: item.description 
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
    header.counter = cartModel.getCount();
});

// Обработчик открытия корзины
events.on('basket:open', () => {
    const basket = new BasketView(cloneTemplate(basketTemplate), {
        onClick: () => events.emit('order:open')
    });

    const items = cartModel.getItems().map((item, index) => {
        const cartItem = new CartItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('card:remove', item)
        });
        return cartItem.render({ ...item, index: index + 1 });
    });

    basket.render({
        items,
        total: cartModel.getTotal(),
        selected: cartModel.getItems().map(item => item.id)
    });

    modal.render({ content: basket.render() });
});

// Обработчик удаления товара из корзины
events.on('card:remove', (item: IProduct) => {
    cartModel.removeItem(item.id);
    events.emit('basket:open');
});

// Обработчик открытия формы заказа
events.on('order:open', () => {
    const orderForm = new OrderForm(cloneTemplate(orderTemplate), {
        onChange: () => events.emit('order:change')
    });

    const buyerData = buyerModel.getData();
    orderForm.render({
        payment: buyerData.payment,
        address: buyerData.address || '',
        valid: false,
        errors: []
    });

    modal.render({ content: orderForm.render() });
});

// Обработчик изменения формы заказа
events.on('order:change', () => {
    // Валидация формы заказа
    const modalContent = document.querySelector('.modal__content');
    if (modalContent) {
        const orderForm = modalContent.querySelector('.form[name="order"]');
        if (orderForm) {
            const addressInput = orderForm.querySelector('input[name="address"]') as HTMLInputElement;
            const paymentButtons = orderForm.querySelectorAll('button.button_alt-active');
            const errorsElement = orderForm.querySelector('.form__errors') as HTMLElement;
            
            const isAddressValid = addressInput.value.trim().length > 0;
            const isPaymentSelected = paymentButtons.length > 0;
            const isValid = isAddressValid && isPaymentSelected;

            // Сохраняем данные в модель
            if (isPaymentSelected) {
                const paymentButton = paymentButtons[0] as HTMLButtonElement;
                buyerModel.setData({
                    payment: paymentButton.name as 'card' | 'cash',
                    address: addressInput.value
                });
            }

            // Отображаем ошибки
            if (errorsElement) {
                if (!isAddressValid) {
                    errorsElement.textContent = 'Необходимо указать адрес';
                } else if (!isPaymentSelected) {
                    errorsElement.textContent = 'Необходимо выбрать способ оплаты';
                } else {
                    errorsElement.textContent = '';
                }
            }

            // Активируем/деактивируем кнопку "Далее"
            const submitButton = orderForm.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitButton) {
                submitButton.disabled = !isValid;
                
                // Добавляем обработчик клика на активную кнопку
                if (isValid) {
                    submitButton.onclick = () => events.emit('order:submit');
                } else {
                    submitButton.onclick = null;
                }
            }
        }
    }
});

// Обработчик отправки формы заказа
events.on('order:submit', () => {
    const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), {
        onChange: () => events.emit('contacts:change')
    });

    const buyerData = buyerModel.getData();
    contactsForm.render({
        email: buyerData.email || '',
        phone: buyerData.phone || '',
        valid: false,
        errors: []
    });

    modal.render({ content: contactsForm.render() });
});

// Обработчик изменения формы контактов
events.on('contacts:change', () => {
    // Валидация формы контактов
    const modalContent = document.querySelector('.modal__content');
    if (modalContent) {
        const contactsForm = modalContent.querySelector('.form[name="contacts"]');
        if (contactsForm) {
            const emailInput = contactsForm.querySelector('input[name="email"]') as HTMLInputElement;
            const phoneInput = contactsForm.querySelector('input[name="phone"]') as HTMLInputElement;
            const errorsElement = contactsForm.querySelector('.form__errors') as HTMLElement;
            
            const isEmailValid = emailInput.value.trim().length > 0;
            const isPhoneValid = phoneInput.value.trim().length > 0;
            const isValid = isEmailValid && isPhoneValid;

            // Сохраняем данные в модель
            buyerModel.setData({
                email: emailInput.value,
                phone: phoneInput.value
            });

            // Отображаем ошибки
            if (errorsElement) {
                if (!isEmailValid && !isPhoneValid) {
                    errorsElement.textContent = 'Необходимо указать email и телефон';
                } else if (!isEmailValid) {
                    errorsElement.textContent = 'Необходимо указать email';
                } else if (!isPhoneValid) {
                    errorsElement.textContent = 'Необходимо указать телефон';
                } else {
                    errorsElement.textContent = '';
                }
            }

            // Активируем/деактивируем кнопку "Оплатить"
            const submitButton = contactsForm.querySelector('button[type="submit"]') as HTMLButtonElement;
            if (submitButton) {
                submitButton.disabled = !isValid;
                
                // Добавляем обработчик клика на активную кнопку
                if (isValid) {
                    submitButton.onclick = () => events.emit('contacts:submit');
                } else {
                    submitButton.onclick = null;
                }
            }
        }
    }
});

// Обработчик отправки формы контактов
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    const orderData: IOrder = {
        payment: buyerData.payment!,
        email: buyerData.email!,
        phone: buyerData.phone!,
        address: buyerData.address!,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
    };

    appApi.createOrder(orderData)
        .then(() => {
            const success = new SuccessView(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });
            success.render({ total: cartModel.getTotal() });
            modal.render({ content: success.render() });

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
