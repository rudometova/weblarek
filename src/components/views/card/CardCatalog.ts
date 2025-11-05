import { ExtendedCard } from './ExtendedCard';
import { IProduct } from '../../../types';

interface ICardCatalog extends IProduct {}

export class CardCatalog extends ExtendedCard<ICardCatalog> {
    constructor(container: HTMLElement, actions?: { onClick: () => void }) {
        super(container);
        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }
}