import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { IProduct } from '../../../types';

interface ICartItem extends IProduct {
    index: number;
}

export class CartItem extends Card<ICartItem> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._deleteButton.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this._index.textContent = value.toString();
    }
}