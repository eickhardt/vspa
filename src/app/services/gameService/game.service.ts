import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GameState } from 'app/models/interfaces/gameState';

/**
 * Service that allows us to communicate with the game server.
 *
 * @export
 * @class GameService
 */
@Injectable()
export class GameService {

  // Main API address and endpoints
  protected _apiUrl: string = 'http://188.166.163.170:8080/gnd-server-0.0.1-SNAPSHOT/api/game';
  protected _startGame: string = '/startGame';
  protected _resetGameUrl: string = '/reset';
  protected _endCurrentTurnUrl: string = '/endTurn';
  protected _buyCardUrl: string = '/buyCard';
  protected _playActionUrl: string = '/playAction';

  protected _gameState$: Subject<GameState> = new Subject<GameState>();

  protected _isInitialized: boolean = false;

  constructor(
    protected _http: HttpClient,
  ) { }

  /**
   * Get the current game state.
   *
   * @returns {Promise<GameState>}
   * @memberof GameService
   */
  public getGameState(): void {
    this._http.get<GameState>(this._apiUrl).toPromise()
      .then((gameState: GameState) => this.emitGameState(gameState));
  }

  /**
   * Supposed to tell how the game is going.
   *
   * @readonly
   * @type {(Subject<GameState>)}
   * @memberof GameService
   */
  public get gameState$(): Subject<GameState> {
    this.getGameState();
    return this._gameState$;
  }

  /**
   * Choose number of players and set of cards to play with. This action starts the game.
   *
   * @param {string} nbOfPlayers
   * @param {Array<string>} include
   * @param {Array<string>} exclude
   * @memberof GameService
   */
  public startGame(nbOfPlayers: string, include: Array<string>, exclude: Array<string>): void {
    this._http.get<GameState>(this._apiUrl + this._startGame, {
      params: {
        nbOfPlayers,
        include: include.join(),
        exclude: exclude.join(),
      },
    }).toPromise().then((gameState: GameState) => this.emitGameState(gameState));
  }

  /**
   * Send cardsChoose cards to play with.
   *
   * @param {Array<string>} include
   * @param {Array<string>} exclude
   * @memberof GameService
   */
  // public pickCardsForCurrentGame(include: Array<string>, exclude: Array<string>): void {
  //   this._http.get<GameState>(this._apiUrl + this._chooseCardsUrl, {
  //     params: {
  //       include: include.join(),
  //       exclude: exclude.join(),
  //     },
  //   }).toPromise().then((gameState: GameState) => this.emitGameState(gameState));
  // }

  /**
   * Ask the game server to reset the game. TODO: Confirmation
   *
   * @returns {void}
   * @memberof GameService
   */
  public resetGame(): void {
    this._http.get<GameState>(this._apiUrl + this._resetGameUrl).toPromise()
      .then((gameState: GameState) => this.emitGameState(gameState));
  }

  /**
   * Ask the game server to end the current turn.
   *
   * @returns {void}
   * @memberof GameService
   */
  public endCurrentTurn(): void {
    this._http.get<GameState>(this._apiUrl + this._endCurrentTurnUrl).toPromise()
      .then((gameState: GameState) => this.emitGameState(gameState));
  }

  /**
   * Ask gameserver to buy the given card for the currently active player.
   *
   * @returns {void}
   * @memberof GameService
   */
  public buyCard(cardName: string): void {
    this._http.get<GameState>(this._apiUrl + this._buyCardUrl, {
      params: { cardName },
    }).toPromise().then((gameState: GameState) => this.emitGameState(gameState));
  }

  /**
   * Emit the given game state.
   *
   * @protected
   * @param {GameState} gameState
   * @memberof GameService
   */
  protected emitGameState(gameState: GameState): void {
    console.log('Emitting game state: ', gameState);
    this._gameState$.next(gameState);
  }
}
