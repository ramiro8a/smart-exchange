import { trigger, transition, style, animate, keyframes  } from '@angular/animations';

export const dialogAnimations = trigger('dialogAnimations', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms', style({ opacity: 0 })),
  ]),
]);

export const puzzleAnimations = trigger('puzzleAnimations', [
    transition(':enter', [
      animate('1000ms', keyframes([
        style({ opacity: 0, transform: 'scale(0.5)', offset: 0 }),
        style({ opacity: 1, transform: 'scale(0.8)', offset: 0.4 }),
        style({ opacity: 1, transform: 'scale(0.8) translateX(20%) translateY(20%)', offset: 0.5 }),
        style({ opacity: 1, transform: 'scale(0.8) translateX(40%) translateY(0%)', offset: 0.6 }),
        style({ opacity: 1, transform: 'scale(0.8) translateX(60%) translateY(-20%)', offset: 0.7 }),
        style({ opacity: 1, transform: 'scale(0.8) translateX(80%) translateY(0%)', offset: 0.8 }),
        style({ opacity: 1, transform: 'scale(1) translateX(0%) translateY(0%)', offset: 1 }),
      ])),
    ]),
]);

