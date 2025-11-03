import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс данных для BasketView
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

// Класс отображения корзины
export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        // Находим элементы корзины
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        // Устанавливаем обработчик на кнопку оформления
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для списка товаров
    set items(value: HTMLElement[]) {
        // Очищаем текущий список
        this._list.innerHTML = '';
        
        // Добавляем новые товары
        if (value.length) {
            value.forEach(item => {
                this._list.appendChild(item);
            });
        } else {
            // Если корзина пуста, показываем сообщение
            this._list.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
        }
    }

    // Сеттер для общей стоимости
    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    // Сеттер для блокировки кнопки оформления
    set selected(value: string[]) {
        this._button.disabled = value.length === 0;
    }

    // Вспомогательный метод для установки текста
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}