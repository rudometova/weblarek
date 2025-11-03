import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Базовый интерфейс для всех форм
interface IFormData {
    valid: boolean;
    errors: string[];
}

// Базовый класс для всех форм
export class Form<T extends IFormData> extends Component<T> {
    protected _submit: HTMLButtonElement | null;
    protected _errors: HTMLElement | null;

    constructor(container: HTMLFormElement) {
        super(container);

        // Находим общие элементы форм (может быть null)
        try {
            this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        } catch {
            this._submit = null;
        }

        try {
            this._errors = ensureElement<HTMLElement>('.form__errors', container);
        } catch {
            this._errors = null;
        }
    }

    // Сеттер для состояния валидности формы
    set valid(value: boolean) {
        if (this._submit) {
            this._submit.disabled = !value;
        }
    }

    // Сеттер для отображения ошибок
    set errors(value: string[]) {
        if (this._errors) {
            this._errors.textContent = value.join(', ');
        }
    }
}