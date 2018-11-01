import { trigger, style, transition, animate } from '@angular/animations';

export const FlyInOutTrigger = trigger('flyInOutTrigger', [
  transition(
    ':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 }),
      animate('350ms', style({ transform: 'translateX(0)', opacity: 1 })),
    ],
  ),
  transition(
    ':leave', [
      style({ transform: 'translateX(0)', opacity: 1, height: 0 }),
      animate('350ms', style({ transform: 'translateX(-10%)', opacity: 0 })),
      // animate('350ms', style({ transform: 'translateX(-10%)', opacity: 0 })),
    ],
  ),
]);
