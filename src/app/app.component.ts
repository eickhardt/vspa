import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { AppState } from './app.service';
import { GameService } from './services/gameService/game.service';
import { GameState } from './models/interfaces/gameState';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

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
export class AppComponent implements OnInit, OnDestroy {
  public name: string = 'Dominion Learning';
  public showDevModule: boolean = environment.showDevModule;

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
   * Holds the cards that EXCLUDED from the game.
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
    private messageService: MessageService,
    protected gameService: GameService,
  ) { }

  /**
   * ngOnInit implementation. Initializes the game service. TODO: Make subscription work!
   *
   * @memberof AppComponent
   */
  public ngOnInit(): void {
    this.mainGameSubscription = this.gameService.gameState$.subscribe((gameState: GameState) => {
      this.gameState = gameState;
    });
  }

  /**
   * ngOnDestroy implementation. Unsubscribes.
   *
   * @memberof AppComponent
   */
  public ngOnDestroy(): void {
    this.mainGameSubscription.unsubscribe();
  }

  /**
   * Starts the game with the currently selected player count and selected / deselected cards.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public setPlayerCountButtonPressed(e: Event): void {
    this.gameService.setPlayerCount(this.selectedPlayerCount).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Player count set', detail: 'Now choose cards to play with :)' });
      this.readyForCardPick = true;
    });
  }

  /**
   * Tell the game service which cards we want to play with.
   *
   * @param {Event} e
   * @memberof AppComponent
   */
  public cardsPickedButtonPressed(e: Event): void {
    this.gameService.pickCardsForCurrentGame(this.includedCards, this.excludedCards).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Cards picked', detail: 'We\'re all set :)' });
      this.readyForCardPick = true;
    });
  }

  /**
   * Cycle through card states as the cards are selected. Allows up to 10 selected cards.
   *
   * @protected
   * @param {string} card
   * @memberof AppComponent
   */
  protected cardSelected(card: string): void {
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
}
