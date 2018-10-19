import { DominionCardDTO } from './dominionCardDto';

export interface PlayerDTO {
  id: number;
  name: string;
  actions: number;
  cardToPlay: DominionCardDTO;
  deck: Array<DominionCardDTO>;
  hand: Array<DominionCardDTO>;
  allCards: Array<DominionCardDTO>;
  discard: Array<DominionCardDTO>;
  buys: number;
  money: number;
  moneyAvailable: number;
  numberOfGardens: number;
}
