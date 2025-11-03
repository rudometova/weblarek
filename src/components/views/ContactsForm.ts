import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IBuyer } from '../../types';

// Интерфейс данных для ContactsForm
interface IContactsFormData {
    valid: boolean;
    errors: string[];
}

// Класс формы контактов (второй шаг)
export class ContactsForm extends Form<IContactsFormData & Pick<IBuyer, 'email' | 'phone'>> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, actions?: { onChange: () => void }) {
        super(container);

        // Находим элементы формы
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        // ПРЕДОТВРАЩАЕМ САБМИТ ФОРМЫ ПРИ ENTER
        container.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        // Устанавливаем обработчики изменений
        this._emailInput.addEventListener('input', () => {
            if (actions?.onChange) actions.onChange();
        });

        this._phoneInput.addEventListener('input', () => {
            if (actions?.onChange) actions.onChange();
        });
    }

    // Сеттер для email
    set email(value: string) {
        if (value) {
            this._emailInput.value = value;
        } else {
            this._emailInput.value = '';
        }
    }

    // Сеттер для телефона
    set phone(value: string) {
        if (value) {
            this._phoneInput.value = value;
        } else {
            this._phoneInput.value = '';
        }
    }

    // Геттеры для данных формы (только для валидации в Presenter)
    get emailValue(): string {
        return this._emailInput.value;
    }

    get phoneValue(): string {
        return this._phoneInput.value;
    }
}