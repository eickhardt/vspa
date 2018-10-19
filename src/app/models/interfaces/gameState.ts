import { PlayerDTO } from '../dtos/playerDto';
import { ActionDTO } from '../dtos/actionDto';

export interface GameState {
  game: any; // TODO: This is not implemented in the API yet
  players: Array<PlayerDTO>;
  possibleActions: Array<ActionDTO>;
  theGameOver: boolean;
}
