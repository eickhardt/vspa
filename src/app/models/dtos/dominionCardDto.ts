import { CardCategory } from '../enums/cardCategory';

/**
 * Represents a single Dominion card.
 *
 * @export
 * @interface DominionCardDTO
 */
export interface DominionCardDTO {
  name: string;
  points: number;
  price: number;
  categories: Array<CardCategory>;
}
