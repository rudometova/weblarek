import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';

interface ICardData {
    title: string;
    price: number | null;
}

export class Card<T extends ICardData> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    // Сеттер для названия 
    set title(value: string) {
        this._title.textContent = value; 
    }

    // Сеттер для цены
    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
        } else {
            this._price.textContent = `${value} синапсов`;
        }
    }

}