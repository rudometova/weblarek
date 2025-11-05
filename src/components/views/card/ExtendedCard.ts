import { Card } from './Card';
import { ensureElement } from '../../../utils/utils';
import { categoryMap, CDN_URL } from '../../../utils/constants';
import { IProduct } from '../../../types';

type CategoryKey = keyof typeof categoryMap;

interface IExtendedCard extends IProduct {}

export class ExtendedCard<T extends IExtendedCard> extends Card<T> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement) {
        super(container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
    }

    // Сеттер для категории
    set category(value: string) {
        this._category.textContent = value; 
        
        Object.keys(categoryMap).forEach(key => {
            const categoryKey = key as CategoryKey;
            this._category.classList.toggle(
                categoryMap[categoryKey],
                key === value
            );
        });
    }

    // Сеттер для изображения
    set image(value: string) {
        const fullImageUrl = value.startsWith('http') ? value : `${CDN_URL}${value}`;
        this._image.src = fullImageUrl;
        this._image.alt = this._title.textContent || ''; 
    }
}