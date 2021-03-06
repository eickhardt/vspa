import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { MessageService, MenuItem } from 'primeng/api';

import { GameService } from './services/gameService/game.service';
import { GameState } from './models/interfaces/gameState';
import { ActionDTO } from './models/dtos/actionDto';
import { PlayerDTO } from './models/dtos/playerDto';
import { SupplyPileDTO } from './models/dtos/supplyPileDto';
import { TurnState } from './models/enums/turnState';
import { DominionCardDTO } from './models/dtos/dominionCardDto';
import { CardUtil } from './util/cardUtil';
import { CardCategory } from './models/enums/cardCategory';
import { FlyInOutTrigger } from './animations/flyInOutTrigger';
import { CardStateService } from './services/cardStateService/cardStateService';
import { OverlayPanel } from 'primeng/overlaypanel';
import { IllusoryCardComponent } from './components/illusoryCard/illusory-card.component';

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
  animations: [
    FlyInOutTrigger,
  ],
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
  protected startGameAnimationIsFinished: boolean = false;
  protected menuItems: Array<MenuItem> = new Array<MenuItem>();
  protected displayStatistics: boolean = false;
  protected showDetailedCardOverlay: boolean = false;
  protected detailedCardName: string = '';

  @ViewChild('detailedCardOverlay') protected detailedCardOverlayPanel: OverlayPanel;
  @ViewChild('mainGameArea') protected mainGameArea: ElementRef;

  constructor(
    protected messageService: MessageService,
    protected confirmationService: ConfirmationService,
    protected gameService: GameService,
    protected cardStateService: CardStateService,
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

    // Listen for card hover effects
    this.cardStateService.hoveredCard$.subscribe((card: string) => {
      if (card === undefined) {
        this.detailedCardOverlayPanel.hide();
      } else {
        this.detailedCardName = card;
        this.detailedCardOverlayPanel.show({}, this.mainGameArea.nativeElement);
      }
    });

    // Menu items
    this.menuItems = [
      {
        label: 'New game',
        icon: 'pi pi-fw pi-star',
        command: (event?: any) => this.newGameButtonPressed(event),
      } as MenuItem,
      {
        label: 'Statistics',
        icon: 'pi pi-fw pi-chart-bar',
        command: (event?: any) => this.menuItemStatisticsPressed(event),
      } as MenuItem,
    ];
  }

  /**
   * Button handler for statistics menu button.
   *
   * @protected
   * @param {Event} e
   * @memberof AppComponent
   */
  protected menuItemStatisticsPressed(e: Event): void {
    this.displayStatistics = true;
  }

  // protected startGameAnimationFinished(e: Event): void {
  //   console.log('startGameAnimationFinished bef', this.startGameAnimationIsFinished, e);
  //   this.startGameAnimationIsFinished = true;
  //   console.log('startGameAnimationFinished aft', this.startGameAnimationIsFinished, e);
  // }

  /**
   * Check if the game is started. Is false until animations have played out as well.
   *
   * @readonly
   * @protected
   * @type {boolean}
   * @memberof AppComponent
   */
  protected get gameIsStarted(): boolean {
    return this.currentPlayer && this.startGameAnimationIsFinished;
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
  protected newGameButtonPressed(e: Event): void {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to start a new game?',
      accept: () => {
        this.resetSelections();
        this.gameService.resetGame();
      },
    });
  }

  /**
   * Resets any selections made.
   *
   * @protected
   * @memberof AppComponent
   */
  protected resetSelections(): void {
    this.startGameAnimationIsFinished = false;
    this.selectedCardInHand = undefined;
    this.selectedSupplyPile = undefined;
    this.selectedPlayerCount = '2';
    this.turnState = TurnState.Action;
    this.excludedCards = [];
    this.includedCards = [];
    this.setTurnState();
  }

  /**
   * Set default turn state.
   *
   * If action count is 0 and or no action cards are in th current players hand, automatically switch to buy mode.
   *
   * @protected
   * @memberof AppComponent
   */
  protected setTurnState(): void {
    if (this.currentPlayer) {
      if (this.currentPlayer.actions === 0 ||
        CardUtil.pileContainsCardWithCategory(this.currentPlayer.hand, CardCategory.Action) === false) {
        this.turnState = TurnState.Buy;
      } else {
        this.turnState = TurnState.Action;
      }
    }
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
      this.gameService.buyCard(this.selectedSupplyPile.card.name);
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
    if (this.gameState) {
      const action: ActionDTO | undefined = this.gameState.possibleActions.find((obj: ActionDTO) => obj.actionName === actionName);
      return action ? true : false;
    }

    return false;
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

    return this.selectedSupplyPile.card.price <= this.currentPlayer.moneyAvailable;
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
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.card, pileB.card));
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
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.card, pileB.card));
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
      .sort((pileA: SupplyPileDTO, pileB: SupplyPileDTO) => CardUtil.sortCardsByPrice(pileA.card, pileB.card));
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

  protected animateCardMovement(fromCoordinates: Coordinates, toCoordinates: Coordinates, card: DominionCardDTO): void {
    const illusoryCard: IllusoryCardComponent = this.createCardIllusionAtCoordinates(fromCoordinates, card);
    illusoryCard.animateToCoordinates(toCoordinates);
  }

  protected createCardIllusionAtCoordinates(coordinates: Coordinates, card: DominionCardDTO): IllusoryCardComponent {
    const illusoryCard: IllusoryCardComponent = this.createIllusoryCard(card);
    illusoryCard.show();

    return illusoryCard;
  }

  protected createIllusoryCard(card: DominionCardDTO): IllusoryCardComponent {
    return new IllusoryCardComponent();
  }
}
