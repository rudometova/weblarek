import { ExtendedCard } from './ExtendedCard';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

interface ICardPreview extends IProduct {
    description: string;
    inBasket?: boolean;
    available?: boolean; 
}

export class CardPreview extends ExtendedCard<ICardPreview> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set inBasket(value: boolean) {
        if (this._button.disabled) return;
        
        if (value) {
            this._button.textContent = 'Удалить из корзины';
            this._button.classList.add('card__button_remove');
        } else {
            this._button.textContent = 'В корзину';
            this._button.classList.remove('card__button_remove');
        }
    }

    set available(value: boolean) {
        if (!value) {
            this._button.setAttribute('disabled', 'true');
            this._button.textContent = 'Недоступно';
            this._button.classList.remove('card__button_remove');
        } else {
            this._button.removeAttribute('disabled');
        }
    }
}