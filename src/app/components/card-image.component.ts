import { Input, Component, Output, EventEmitter } from '@angular/core';

/**
 * Represents a card image in html.
 *
 * @export
 * @class CardImageComponent
 */
@Component({
  selector: 'card-image',
  styleUrls: ['./card-image.component.scss'],
  templateUrl: './card-image.component.html',
})
export class CardImageComponent {

  /**
   * Name of the card. Corresponds to the image filename as well.
   *
   * @type {string}
   * @memberof CardImageComponent
   */
  @Input() public cardName: string = '';

  /**
   * Tooltip of the card. Defaults to cardName: price.
   *
   * @type {boolean}
   * @memberof CardImageComponent
   */
  @Input() public tooltip: string = this.cardName;

  /**
   * Wether or not the card is disabled. Grays it out.
   *
   * @type {boolean}
   * @memberof CardImageComponent
   */
  @Input() public disabled: boolean = false;

  /**
   * Wether or not the card is selected. Adds blue border.
   *
   * @type {boolean}
   * @memberof CardImageComponent
   */
  @Input() public selected: boolean = false;

  /**
   * Wether or not the card is deselected. Adds red border.
   *
   * @type {boolean}
   * @memberof CardImageComponent
   */
  @Input() public deselected: boolean = false;
}
