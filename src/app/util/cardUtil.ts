import { DominionCardDTO } from 'app/models/dtos/dominionCardDto';
import { SupplyPileDTO } from 'app/models/dtos/supplyPileDto';
import { CardCategory } from 'app/models/enums/cardCategory';

export class CardUtil {

  /**
   * Check if the given card is an action card.
   *
   * @static
   * @param {DominionCardDTO} card
   * @returns {boolean}
   * @memberof CardUtil
   */
  public static cardIsAction(card: DominionCardDTO): boolean {
    return card.cardCategory.indexOf(CardCategory.Action) > -1;
  }

  /**
   * Compares two card prices. Used for sorting.
   *
   * @static
   * @param {DominionCardDTO} cardA
   * @param {DominionCardDTO} cardB
   * @returns {number}
   * @memberof CardUtil
   */
  public static sortCardsByPrice(cardA: DominionCardDTO, cardB: DominionCardDTO): number {
    if (cardA.price > cardB.price) {
      return 1;
    } else if (cardA.price < cardB.price) {
      return -1;
    }
    return 0;
  }

  /**
   * Filter the supply piles by the given categories. Flag for inclusion or exclution can be set. Default is inclusion.
   *
   * @static
   * @param {Array<CardCategory>} categories
   * @param {Array<SupplyPileDTO>} piles
   * @returns {Array<SupplyPileDTO>}
   * @memberof CardUtil
   */
  public static filterSupplyPilesByCategories(
    piles: Array<SupplyPileDTO>,
    categories: Array<CardCategory>,
    excludeMatched?: boolean,
  ): Array<SupplyPileDTO> {
    if (!excludeMatched) {
      excludeMatched = false;
    }

    return piles.filter((pile: SupplyPileDTO) => {
      let includePile: boolean = excludeMatched;
      categories.forEach((category: CardCategory) => {
        if (pile.dominionCard.cardCategory.indexOf(category) > -1) {
          includePile = !excludeMatched;
        }
      });

      return includePile;
    });
  }
}
