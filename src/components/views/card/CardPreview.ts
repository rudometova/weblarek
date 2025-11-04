import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

// Интерфейс данных для CardPreview - ДОБАВЛЕНО available
interface ICardPreview extends IProduct {
    description: string;
    inBasket?: boolean;
    available?: boolean; 
}

// Класс карточки товара в модальном окне
export class CardPreview extends Card<ICardPreview> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        // Находим дополнительные элементы, специфичные для превью
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        // Устанавливаем обработчик на кнопку
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для описания
    set description(value: string) {
        this.setText(this._description, value);
    }

    // Сеттер для статуса корзины (меняет текст кнопки)
    set inBasket(value: boolean) {
        if (this._button.disabled) return; // Не меняем текст если кнопка заблокирована
        
        if (value) {
            this._button.textContent = 'Удалить из корзины';
            this._button.classList.add('card__button_remove');
        } else {
            this._button.textContent = 'В корзину';
            this._button.classList.remove('card__button_remove');
        }
    }

    // Сеттер для доступности товара - НОВЫЙ СЕТТЕР
    set available(value: boolean) {
        if (!value) {
            this._button.setAttribute('disabled', 'true');
            this._button.textContent = 'Недоступно';
            this._button.classList.remove('card__button_remove');
        } else {
            this._button.removeAttribute('disabled');
            // Текст установится через сеттер inBasket
        }
    }

}