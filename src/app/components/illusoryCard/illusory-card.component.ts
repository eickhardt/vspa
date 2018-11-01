import { trigger, style, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  // styleUrls: ['./illusory-card.component.scss'],
  templateUrl: './illusory-card.component.html',
  animations: [
    trigger('illusoryCardMoveTrigger', [
      transition('void <=> ready', []),
      transition('ready <=> arrived', [
        style({ height: '{{startHeight}}px', opacity: 0 }),
        animate('.5s ease'),
      ], { params: { startHeight: 0 } }),
    ]),
  ],
})
export class IllusoryCardComponent {

  protected visible: boolean = false;

  constructor() { }

  public show(): void {
    this.visible = true;
  }

  public animateToCoordinates(coordinates: Coordinates): void {
    // this.state = 'arrived';
  }
}

// describe('MyComponenet', () => {
//   it('should be in order'. () => {
//     // Arrange
//     // set up condiction

//     // Act
//     // Change condictions

//     // Assert
//     // Expect
//     expect(card.isVisible()).toBeTrue();
//     expect(element(by.css('illusory-card'))).toBeDefined();

//   })
// })
