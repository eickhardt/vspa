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
  cardCategory: Array<string>;
}
