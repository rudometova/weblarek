import { IBuyer, IValidationErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private _data: Partial<IBuyer> = {};

    constructor(protected events: IEvents) {}

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
        this.events.emit('buyer:changed', this._data);
    }

    getData(): Partial<IBuyer> {
        return this._data;
    }

    clear(): void {
        this._data = {};
        this.events.emit('buyer:changed', this._data);
    }

    validate(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this._data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this._data.email) {
            errors.email = 'Укажите email';
        }

        if (!this._data.phone) {
            errors.phone = 'Укажите телефон';
        }

        if (!this._data.address) {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }
}