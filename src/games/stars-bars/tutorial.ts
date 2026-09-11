// Tutorial content for Stars & Bars
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const starsBarsTutorial: TutorialConfig = {
  id: 'stars-bars-basics',
  name: 'Learn Stars & Bars',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Stars & Bars!',
      message: `
        <p>Let's learn how to play <strong>Stars & Bars</strong>!</p>
        <p>Score 30 points by placing attribute cards with maximum differences from adjacent cards!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Score 30 points by placing attribute cards with maximum differences from adjacent cards!</p>
      `,
      position: 'center',
    },
    {
      id: 'attribute-cards',
      title: 'Attribute Cards',
      message: `
        <p>Each card has 4 attributes:</p>
        <ul>
          <li><strong>Shape:</strong> Circle, Square, Triangle, Hexagon, Rectangle</li>
          <li><strong>Color:</strong> Red, Blue, Yellow</li>
          <li><strong>Size:</strong> Small, Large</li>
          <li><strong>Thickness:</strong> Thin, Thick</li>
        </ul>
      `,
      highlightSelector: '.stars-hand',
      position: 'bottom',
    },
    {
      id: 'scoring',
      title: 'Scoring',
      message: `
        <ul>
          <li>Compare your card to ALL adjacent cards (8 directions)</li>
          <li>Score 1 point for each attribute that differs</li>
          <li>Maximum 4 points per adjacent card (all different)</li>
          <li>Star cells double your points!</li>
        </ul>
      `,
      highlightSelector: '.stars-board',
      position: 'top',
    },
    {
      id: 'examples',
      title: 'Examples',
      message: `
        <ul>
          <li>Same shape, same color, different size, different thickness = 2 points</li>
          <li>All 4 attributes different = 4 points</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li>Select a card from your hand</li>
          <li>Place it on a green (valid) cell</li>
          <li>Must place adjacent to existing cards</li>
        </ol>
      `,
      highlightSelector: '.stars-board',
      position: 'bottom',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Maximize differences from adjacent cards</li>
          <li>Star cells (corners + center) double points</li>
          <li>Position cards for multiple adjacencies</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Stars & Bars!</p>
        <p>Click <strong>Finish</strong> and aim for 30!</p>
      `,
      position: 'center',
    },
  ],
};
