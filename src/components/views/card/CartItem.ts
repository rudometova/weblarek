import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

// Интерфейс данных для CartItem
interface ICartItem extends IProduct {
    index?: number;
}

// Класс карточки товара в корзине
export class CartItem extends Card<ICartItem> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        // Находим элементы, специфичные для корзины
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        // Устанавливаем обработчик на кнопку удаления
        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для номера позиции в корзине
    set index(value: number) {
        this.setText(this._index, String(value));
    }

    // Переопределяем сеттер категории (в корзине категория не отображается)
    set category(_value: string) {
        // В корзине категория не отображается, поэтому игнорируем
    }

    // Переопределяем сеттер изображения (в корзине изображение не отображается)
    set image(_value: string) {
        // В корзине изображение не отображается, поэтому игнорируем
    }
}