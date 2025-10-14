import { IBuyer, IValidationErrors } from '../../types';

export class Buyer {
    private _data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this._data = { ...this._data, ...data };
    }

    getData(): Partial<IBuyer> {
        return this._data;
    }

    clear(): void {
        this._data = {};
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