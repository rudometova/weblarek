import { Component } from '../../base/Component';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants'; 

// Базовый интерфейс для всех карточек
interface ICardData {
    title: string;
    price: number | null;
    category?: string;
    image?: string;
}

// Тип для ключей categoryMap
type CategoryKey = keyof typeof categoryMap;

// Базовый класс для всех карточек товара
export class Card<T extends ICardData> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _category: HTMLElement | null;
    protected _image: HTMLImageElement | null;

    constructor(container: HTMLElement) {
        super(container);
        
        // Находим общие элементы, которые есть во всех карточках
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        
        // Опциональные элементы (могут отсутствовать в некоторых карточках)
        try {
            this._category = ensureElement<HTMLElement>('.card__category', container);
        } catch {
            this._category = null;
        }
        
        try {
            this._image = ensureElement<HTMLImageElement>('.card__image', container);
        } catch {
            this._image = null;
        }
    }

    // Сеттер для названия
    set title(value: string) {
        this.setText(this._title, value);
    }

    // Сеттер для цены
    set price(value: number | null) {
        if (value === null) {
            this.setText(this._price, 'Бесценно');
        } else {
            this.setText(this._price, `${value} синапсов`);
        }
    }

    // Сеттер для категории
    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            // Устанавливаем класс категории
            Object.keys(categoryMap).forEach(key => {
                // Приводим key к типу CategoryKey
                const categoryKey = key as CategoryKey;
                this._category!.classList.toggle(
                    categoryMap[categoryKey],
                    key === value
                );
            });
        }
    }

    // Сеттер для изображения
    set image(value: string) {
    if (this._image && value) {
        const fullImageUrl = value.startsWith('http') ? value : `${CDN_URL}${value}`;
        this.setImage(this._image, fullImageUrl, this._title?.textContent || '');
    }
}

    // Вспомогательный метод для установки текста
    protected setText(element: HTMLElement, value: string) {
        if (element) {
            element.textContent = value;
        }
    }
}