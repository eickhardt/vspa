import { Input, Component } from '@angular/core';
import { CardStateService } from 'app/services/cardStateService/cardStateService';

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
  @Input() public detailed: boolean = false;
  @Input() public grow: boolean = true;

  constructor(
    protected cardStateService: CardStateService,
  ) {}
}
