import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { GameService } from './services/gameService/game.service';
import { GameState } from './models/interfaces/gameState';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActionDTO } from './models/dtos/actionDto';
import { PlayerDTO } from './models/dtos/playerDto';
import { SupplyPileDTO } from './models/dtos/supplyPileDto';

export const ROOT_SELECTOR = 'app';

/**
 * Top level component.
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 */
@Component({
  selector: ROOT_SELECTOR,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public name: string = 'Dominion Learning';

  /**
   * If true we are ready to allow the user to pick which cards to use for the game.
   *
   * @protected
   * @type {boolean}
   * @memberof AppComponent
   */
  protected readyForCardPick: boolean = false;

  /**
   * The subscription that will provide the game state.
   *
   * @protected
   * @type {Subscription}
   * @memberof AppComponent
   */
  protected mainGameSubscription: Subscription;

  /**
   * The currently selected supply pile.
   *
   * @protected
   * @type {SupplyPileDTO}
   * @memberof AppComponent
   */
  protected selectedSupplyPile: SupplyPileDTO;

  /**
   * Allowed player counts.
   *
   * @protected
   * @type {Array<string>}
   * @memberof AppComponent
   */
  protected playerCountOptions: Array<string> = ['2', '3', '4'];

  /**
   * The currently selected number of players in the game.
   *
   * @protected
   * @type {number}
   * @memberof AppComponent
   */
  protected selectedPlayerCount: string = '2';

  /**
   * Holds the cards that are INCLUDED in the game. Max 10 cards!
   *
   * @protected
   * @type {Array<string>}
   * @memberof AppComponent
   */
  protected includedCards: Array<string> = new Array<string>();

  /**
   * Holds the cards that are EXCLUDED from the game.
   *
   * @protected
   * @type {Array<string>}
   * @memberof AppComponent
   */
  protected excludedCards: Array<string> = new Array<string>();

  /**
   * Holds the current state of the game as received from the API. TODO: Make subscription work!
   *
   * @protected
   * @type {GameState}
   * @memberof AppComponent
   */
  protected gameState: GameState;

  constructor(
    protected appState: AppState,
    protected messageService: MessageService,
    protected gameService: GameService,
  ) { }

  /**
   * ngOnInit implementation. Initializes the game service. TODO: Make subscription work!
   *
   * @memberof AppComponent
   */
  public ngOnInit(): void {

    // Subscribe for game state updates
    this.gameService.gameState$.subscribe((gameState: GameState) => {
      this.gameState = gameState;
    });

    // Subscribe for messages to be displayed
    // this.gameService.message$.subscribe((gameState: GameState) => {
    //   this.messageService.add({ severity: 'success', summary: 'Player count set', detail: 'Now choose cards to play with :)' });
    // });
  }

  /**
   * Starts the game with the currently selected player count and selected / deselected cards.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public startGameButtonPressed(e: Event): void {
    this.gameService.startGame(this.selectedPlayerCount, this.includedCards, this.excludedCards);
  }

  /**
   * Ask the game server to reset the game.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public resetGameButtonPressed(e: Event): void {
    this.gameService.resetGame();
  }

  /**
   * End the turn of the current player.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public endTurnButtonPressed(e: Event): void {
    this.selectedSupplyPile = undefined;
    this.gameService.endCurrentTurn();
  }

  /**
   * Buy the selected card if the player can afford it.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public buyCardButtonPressed(e: Event): void {
    if (this.canBuySelectedCard()) {
      this.gameService.buyCard(this.selectedSupplyPile.dominionCard.name);
    }
  }

  /**
   * Check if the given action is currently available.
   *
   * @protected
   * @returns {boolean}
   * @memberof AppComponent
   */
  protected isActionAvailable(actionName: string): boolean {
    const action: ActionDTO | undefined = this.gameState.possibleActions.find((obj: ActionDTO) => obj.actionName === actionName);
    return action ? true : false;
  }

  /**
   * Cycle through card states as the cards are selected. Allows up to 10 selected cards.
   *
   * @protected
   * @param {string} card
   * @memberof AppComponent
   */
  protected gameCardSelected(card: string): void {
    const includedIndex: number = this.includedCards.indexOf(card);
    const excludedIndex: number = this.excludedCards.indexOf(card);
    if (excludedIndex > -1) {
      this.excludedCards.splice(excludedIndex, 1);
    } else if (includedIndex > -1) {
      this.includedCards.splice(includedIndex, 1);
      this.excludedCards.push(card);
    } else {
      if (this.includedCards.length < 10) {
        this.includedCards.push(card);
      } else {
        this.excludedCards.push(card);
      }
    }
  }

  /**
   * Check if the current payer can buy the card they have selected from the supply piles.
   *
   * @protected
   * @returns {boolean}
   * @memberof AppComponent
   */
  protected canBuySelectedCard(): boolean {
    if (!this.selectedSupplyPile) {
      return false;
    }

    return this.selectedSupplyPile.dominionCard.price <= this.currentPlayer.moneyAvailable;
  }

  /**
   * Helper method for cleaner code. Provides access to the current player dto object.
   *
   * @protected
   * @returns {PlayerDTO}
   * @memberof AppComponent
   */
  protected get currentPlayer(): PlayerDTO | undefined {
    if (this.gameState && this.gameState.players.length) {
      return this.gameState.players[this.gameState.gameMeta.currentPlayerId];
    } else {
      return undefined;
    }
  }
}
