import { SupplyPileDTO } from '../dtos/supplyPileDto';
import { DominionCardDTO } from '../dtos/dominionCardDto';

export interface GameMeta {
  currentPlayerId: number;
  supplyPiles: Array<SupplyPileDTO>;
  turnPlayed: number;
  cardsAvailable: Array<DominionCardDTO>;
}
