import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Интерфейс данных для Header
interface IHeader {
    counter: number;
}

// Класс Header компонента
export class Header extends Component<IHeader> {
    protected _counter: HTMLElement;
    protected _basket: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Находим элементы в разметке
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);
        this._basket = ensureElement<HTMLButtonElement>('.header__basket', container);

        // Добавляем обработчик клика на корзину
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    // Сеттер для обновления счетчика
    set counter(value: number) {
        this._counter.textContent = String(value);
    }
}