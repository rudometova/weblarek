import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс данных для SuccessView
interface ISuccessView {
    total: number;
}

// Класс успешного оформления заказа
export class SuccessView extends Component<ISuccessView> {
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        // Находим элементы
        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

        // Устанавливаем обработчик на кнопку закрытия
        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    // Сеттер для общей стоимости
    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }

    // Вспомогательный метод для установки текста
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}