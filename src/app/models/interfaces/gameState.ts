import { PlayerDTO } from '../dtos/playerDto';
import { ActionDTO } from '../dtos/actionDto';
import { GameMeta } from './gameMeta';

export interface GameState {
  gameMeta: GameMeta; // TODO: This is not implemented in the API yet
  players: Array<PlayerDTO>;
  possibleActions: Array<ActionDTO>;
  theGameOver: boolean;
}
