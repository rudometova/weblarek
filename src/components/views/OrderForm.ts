import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IBuyer } from '../../types';

// Интерфейс данных для OrderForm
interface IOrderFormData {
    valid: boolean;
    errors: string[];
}

// Класс формы оформления заказа (первый шаг)
export class OrderForm extends Form<IOrderFormData & Pick<IBuyer, 'payment' | 'address'>> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, actions?: { onChange: () => void }) {
        super(container);

        // Находим элементы формы
        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

        // ПРЕДОТВРАЩАЕМ САБМИТ ФОРМЫ ПРИ ENTER
        container.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        // Устанавливаем обработчики
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name as 'card' | 'cash');
                if (actions?.onChange) actions.onChange();
            });
        });

        this._addressInput.addEventListener('input', () => {
            if (actions?.onChange) actions.onChange();
        });
    }

    // Выбор способа оплаты
    selectPayment(method: 'card' | 'cash') {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }

    // Сеттер для способа оплаты
    set payment(value: 'card' | 'cash' | undefined) {
        if (value) {
            this.selectPayment(value);
        }
    }

    // Сеттер для адреса
    set address(value: string) {
        if (value) {
            this._addressInput.value = value;
        } else {
            this._addressInput.value = '';
        }
    }

    // Геттер для данных формы (только для валидации в Presenter)
    get addressValue(): string {
        return this._addressInput.value;
    }

    get paymentValue(): 'card' | 'cash' | undefined {
        const activeButton = this._paymentButtons.find(button => 
            button.classList.contains('button_alt-active')
        );
        return activeButton?.name as 'card' | 'cash';
    }
}