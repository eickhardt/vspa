import { Injectable } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';
import { DominionCardDTO } from 'app/models/dtos/dominionCardDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GameState } from 'app/models/interfaces/gameState';

/**
 * Service that allows us to communicate with the game server.
 *
 * @export
 * @class GameService
 */
@Injectable()
export class GameService {

  protected _isInitialized: boolean = false;

  protected _apiUrl: string = 'http://188.166.163.170:8080/gnd-server-0.0.1-SNAPSHOT/api/game';

  protected _chooseNbOfPlayersUrl: string = '/chooseNbOfPlayers';
  protected _chooseCardsUrl: string = '/chooseCards';

  protected _mainGameSubscription: Subscription;

  protected _gameState$: BehaviorSubject<GameState | undefined> = new BehaviorSubject<GameState | undefined>(undefined);

  constructor(
    protected _http: HttpClient,
  ) { }

  /**
   * Supposed to tell how the game is going - TODO: Subscription not currently working.
   *
   * @readonly
   * @type {(BehaviorSubject<GameState | undefined>)}
   * @memberof GameService
   */
  public get gameState$(): BehaviorSubject<GameState | undefined> {
    this.init();
    return this._gameState$;
  }

  /**
   * Initiate this service if it isn't already - TODO: Subscription not currently working.
   *
   * @memberof GameService
   */
  public init(): void {
    if (!this._isInitialized) {
      this._mainGameSubscription = this._http.get(this._apiUrl).subscribe((result: GameState) => {
        this._gameState$.next(result);
      });
      this._isInitialized = true;
    }
  }

  /**
   * Choose number of players.
   *
   * @param {string} nbOfPlayers
   * @memberof GameService
   */
  public setPlayerCount(nbOfPlayers: string): Promise<GameState> {
    return this._http.get<GameState>(this._apiUrl + this._chooseNbOfPlayersUrl, {
      params: {
        nbOfPlayers,
      },
    }).toPromise();
  }

  /**
   * Choose cards to play with.
   *
   * @param {Array<string>} include
   * @param {Array<string>} exclude
   * @memberof GameService
   */
  public pickCardsForCurrentGame(include: Array<string>, exclude: Array<string>): Promise<GameState> {
    return this._http.get<GameState>(this._apiUrl + this._chooseCardsUrl, {
      params: {
        include: include.join(),
        exclude: exclude.join(),
      },
    }).toPromise();
  }
}
