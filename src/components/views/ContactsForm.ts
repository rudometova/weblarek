import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

// Интерфейс данных для ContactsForm
interface IContactsForm {
    email: string;
    phone: string;
    valid: boolean;
    errors: string[];
}

// Класс формы контактов (второй шаг)
export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        // Находим элементы формы
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        // Устанавливаем обработчики изменений
        this._emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'email', 
                value: this._emailInput.value 
            });
        });

        this._phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change', { 
                field: 'phone', 
                value: this._phoneInput.value 
            });
        });
    }

    // Сеттер для email
    set email(value: string) {
        this._emailInput.value = value || '';
    }

    // Сеттер для телефона
    set phone(value: string) {
        this._phoneInput.value = value || '';
    }

   
}