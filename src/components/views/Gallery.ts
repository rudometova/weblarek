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
        this._catalog.replaceChildren(...items);
    }
}