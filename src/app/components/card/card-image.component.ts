import { Input, Component } from '@angular/core';

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
  @Input() public cardName: string = '';
  @Input() public tooltip: string = this.cardName;
  @Input() public countNumber: number;
  @Input() public disabled: boolean = false;
  @Input() public selected: boolean = false;
  @Input() public deselected: boolean = false;
}
