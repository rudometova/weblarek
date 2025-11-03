import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

// Интерфейс данных для Modal
interface IModal {
    content: HTMLElement | null;
}

// Класс Modal компонента
export class Modal extends Component<IModal> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        // Находим элементы в разметке
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        // Обработчики закрытия модального окна
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Сеттер для установки контента
    set content(value: HTMLElement | null) {
        if (value) {
            this._content.replaceChildren(value);
        } else {
            this._content.innerHTML = '';
        }
    }

    // Открытие модального окна
    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // Закрытие модального окна
    close(): void {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    // Рендер с дополнительной логикой
    render(data?: Partial<IModal>): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}