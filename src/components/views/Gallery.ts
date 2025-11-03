import { Component } from '../base/Component';

// Интерфейс данных для Gallery
interface IGallery {
    catalog: HTMLElement[];
}

// Класс Gallery компонента
export class Gallery extends Component<IGallery> {
    protected _catalog: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        // Контейнер для карточек - это сам элемент gallery
        this._catalog = container;
    }

    // Сеттер для обновления каталога
    set catalog(items: HTMLElement[]) {
        // Очищаем текущий каталог
        this._catalog.innerHTML = '';
        
        // Добавляем новые карточки
        if (items.length) {
            items.forEach(item => {
                this._catalog.appendChild(item);
            });
        }
    }
}