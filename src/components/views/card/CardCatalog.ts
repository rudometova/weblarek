import { Card } from './Card';
import { IProduct } from '../../../types';

// Интерфейс данных для CardCatalog
interface ICardCatalog extends IProduct {
    // Наследует все поля IProduct
}

// Класс карточки товара в каталоге
export class CardCatalog extends Card<ICardCatalog> {
    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);

        // Устанавливаем обработчик клика на всю карточку
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    // Дополнительный сеттер для блокировки карточки, если товар недоступен
    set price(value: number | null) {
        super.price = value;
        
        // Если цена null, НЕ блокируем карточку на главной, только в модальном
        // На главной карточка выглядит нормально, но при клике покажет "Недоступно"
        if (value === null) {
            // Убираем блокировку на главной странице
            this.container.removeAttribute('disabled');
            this.container.classList.remove('card_disabled');
        }
    }
}