import { IProduct } from '../../types';
import { IEvents } from '../base/Events'; // Исправленный путь

export class Cart {
    private _items: IProduct[] = [];

    constructor(protected events: IEvents) {}

    getItems(): IProduct[] {
        return this._items;
    }

    addItem(item: IProduct): void {
        this._items.push(item);
        this.events.emit('cart:changed');
    }

    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.events.emit('cart:changed');
    }

    clear(): void {
        this._items = [];
        this.events.emit('cart:changed');
    }

    getTotal(): number {
        return this._items.reduce((total, item) => {
            return total + (item.price || 0);
        }, 0);
    }

    getCount(): number {
        return this._items.length;
    }

    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }
}