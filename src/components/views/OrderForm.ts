import { Form } from './Form';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

// Интерфейс данных для OrderForm
interface IOrderForm {
    payment: 'card' | 'cash' | undefined;
    address: string;
    valid: boolean;
    errors: string[];
}

// Класс формы оформления заказа (первый шаг)
export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);

        // Находим элементы формы
        this._paymentButtons = ensureAllElements<HTMLButtonElement>('button[name]', this.container);
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        // Устанавливаем обработчики
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:change', { 
                    field: 'payment', 
                    value: button.name as 'card' | 'cash'
                });
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.events.emit('order:change', { 
                field: 'address', 
                value: this._addressInput.value 
            });
        });
    }

    // Сеттер для способа оплаты (вызывается из презентера после сохранения в модели)
    set payment(value: 'card' | 'cash' | undefined) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    // Сеттер для адреса (вызывается из презентера после сохранения в модели)
    set address(value: string) {
        this._addressInput.value = value || '';
    }

   
}