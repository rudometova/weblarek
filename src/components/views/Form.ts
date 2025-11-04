import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

// Базовый интерфейс для всех форм
interface IFormData {
    valid: boolean;
    errors: string[];
}

// Базовый класс для всех форм
export class Form<T extends IFormData> extends Component<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        // Находим общие элементы форм (обязательные)
        this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        // Обработка сабмита формы - УЛУЧШЕННАЯ ВЕРСИЯ
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.getAttribute('name')}:submit`);
        });
    }

    // Сеттер для состояния валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Сеттер для отображения ошибок
    set errors(value: string[]) {
        this._errors.textContent = value.join(', ');
    }
}