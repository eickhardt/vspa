import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Service that allows us to communicate with the game server.
 *
 * @export
 * @class GameService
 */
@Injectable()
export class CardStateService {

  protected _hoveredCard$: Subject<string | undefined> = new Subject<string | undefined>();

  public get hoveredCard$(): Subject<string | undefined> {
    return this._hoveredCard$;
  }

  constructor() { }

  public cardMouseEnter(card: string): void {
    this._hoveredCard$.next(card);
  }

  public cardMouseLeave(card: string): void {
    this._hoveredCard$.next(undefined);
  }
}
