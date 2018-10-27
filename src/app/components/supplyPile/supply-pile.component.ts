import { Input, Component } from '@angular/core';
import { SupplyPileDTO } from 'app/models/dtos/supplyPileDto';
import { PlayerDTO } from 'app/models/dtos/playerDto';

/**
 * Represents a supply pile html.
 *
 * @export
 * @class SupplyPileComponent
 */
@Component({
  selector: 'supply-pile',
  templateUrl: './supply-pile.component.html',
})
export class SupplyPileComponent {
  @Input() public pile: SupplyPileDTO;
  @Input() public currentPlayer: PlayerDTO;
  @Input() public selected: boolean = false;
}
