import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';
import { GameService } from './services/gameService/game.service';
import { GameState } from './models/interfaces/gameState';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ActionDTO } from './models/dtos/actionDto';
import { PlayerDTO } from './models/dtos/playerDto';
import { SupplyPileDTO } from './models/dtos/supplyPileDto';
import { TurnState } from './models/enums/turnState';
import { DominionCardDTO } from './models/dtos/dominionCardDto';
import { CardUtil } from './util/cardUtil';
import { CardCategory } from './models/enums/cardCategory';

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
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public name: string = 'Dominion Learning';

  protected turnStates = TurnState;
  protected turnState: TurnState = TurnState.Action;
  protected gameSubscription: Subscription;
  protected gameState: GameState;
  protected cachedCurrentPlayer: number;
  protected selectedSupplyPile: SupplyPileDTO;
  protected selectedCardInHand: DominionCardDTO;
  protected playerCountOptions: Array<string> = ['2', '3', '4'];
  protected selectedPlayerCount: string = '2';
  protected includedCards: Array<string> = new Array<string>();
  protected excludedCards: Array<string> = new Array<string>();

  constructor(
    protected appState: AppState,
    protected messageService: MessageService,
    protected gameService: GameService,
  ) { }

  /**
   * ngOnInit implementation. Subscribes to the game service.
   *
   * @memberof AppComponent
   */
  public ngOnInit(): void {
    this.gameService.gameState$.subscribe((gameState: GameState) => {
      this.gameState = gameState;

      // If a new player has gotten the turn, reset selections
      if (this.cachedCurrentPlayer !== this.gameState.gameMeta.currentPlayerId) {
        this.resetSelections();
        this.cachedCurrentPlayer = this.gameState.gameMeta.currentPlayerId;
      }
    });
  }

  /**
   * Starts the game with the currently selected player count and selected / deselected cards.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  protected startGameButtonPressed(e: Event): void {
    this.gameService.startGame(this.selectedPlayerCount, this.includedCards, this.excludedCards);
  }

  /**
   * Ask the game server to reset the game. Also resets any selections made.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  protected resetGameButtonPressed(e: Event): void {
    this.resetSelections();
    this.gameService.resetGame();
  }

  /**
   * Resets any selections made.
   *
   * @protected
   * @memberof AppComponent
   */
  protected resetSelections(): void {
    this.selectedCardInHand = undefined;
    this.selectedSupplyPile = undefined;
    this.selectedPlayerCount = '2';
    this.turnState = TurnState.Action;
  }

  /**
   * End the turn of the current player.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  protected endTurnButtonPressed(e: Event): void {
    this.selectedSupplyPile = undefined;
    this.gameService.endCurrentTurn();
  }

  /**
   * Buy the currently selected card if the player can afford it.
   *
   * @memberof AppComponent
   */
  protected buyCard(): void {
    if (this.canBuySelectedCard()) {
      this.gameService.buyCard(this.selectedSupplyPile.dominionCard.name);
    }
  }

  /**
   * Ask game server to play the currently selected card in hand.
   *
   * @protected
   * @memberof AppComponent
   */
  protected playSelectedCardFromHand(): void {
    this.gameService.playCard(this.selectedCardInHand.name);
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

  /**
   * Get the supply piles that are treasures.
   *
   * @readonly
   * @protected
   * @type {Array<SupplyPileDTO>}
   * @memberof AppComponent
   */
  protected get treasureSupplies(): Array<SupplyPileDTO> {
    return CardUtil.filterSupplyPilesByCategories(this.gameState.gameMeta.supplyPiles, [CardCategory.Treasure])
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.dominionCard, pileB.dominionCard));
  }

  /**
   * Get the supply piles that are victory points.
   *
   * @readonly
   * @protected
   * @type {Array<SupplyPileDTO>}
   * @memberof AppComponent
   */
  protected get victorySupplies(): Array<SupplyPileDTO> {
    return CardUtil.filterSupplyPilesByCategories(this.gameState.gameMeta.supplyPiles, [CardCategory.Victory])
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.dominionCard, pileB.dominionCard));
  }

  /**
   * Get the game specific supplies.
   *
   * @readonly
   * @protected
   * @type {Array<SupplyPileDTO>}
   * @memberof AppComponent
   */
  protected get gameSupplies(): Array<SupplyPileDTO> {
    return CardUtil.filterSupplyPilesByCategories(this.gameState.gameMeta.supplyPiles, [CardCategory.Victory, CardCategory.Treasure], true)
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.dominionCard, pileB.dominionCard));
  }

  /**
   * When the player presses a supply pile, check if they have pressed it twice and attempt to buy the card if in buy mode.
   *
   * @protected
   * @param {SupplyPileDTO} pile
   * @memberof AppComponent
   */
  protected supplyPileSelected(pile: SupplyPileDTO): void {
    if (this.selectedSupplyPile === pile) {
      // Second click
      if (this.turnState === TurnState.Buy) {
        this.buyCard();
      }
    }
    this.selectedSupplyPile = pile;
  }

  /**
   * When the player presses a card in hand, check if they have pressed it twice and attempt to play it if it's an action.
   *
   * @protected
   * @param {DominionCardDTO} card
   * @memberof AppComponent
   */
  protected cardSelectedInHand(card: DominionCardDTO): void {
    if (this.selectedCardInHand === card) {
      // Second click
      if (this.turnState === TurnState.Action && CardUtil.cardIsAction(card) && this.currentPlayer.actions) {
        this.playSelectedCardFromHand();
      }
    }
    this.selectedCardInHand = card;
  }
}
