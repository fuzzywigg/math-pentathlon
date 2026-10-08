// Tutorial content for Sum Dominoes & Dice
// Next-only steps ported from existing How-to / helpContentHtml

import type { TutorialConfig } from '../../core/tutorial';

export const sumDominoesTutorial: TutorialConfig = {
  id: 'sum-dominoes-basics',
  name: 'Learn Sum Dominoes & Dice',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Sum Dominoes & Dice!',
      message: `
        <p>Let's learn how to play <strong>Sum Dominoes & Dice</strong>!</p>
        <p>Be the first player to get rid of all your dominoes!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Be the first player to get rid of all your dominoes!</p>
      `,
      position: 'center',
    },
    {
      id: 'setup',
      title: 'Setup',
      message: `
        <ul>
          <li>Each player receives 7 dominoes</li>
          <li>A starting domino is placed in the center of the board</li>
        </ul>
      `,
      highlightSelector: '.sd-board',
      position: 'bottom',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Roll Dice:</strong> Roll two dice to get a target sum (2-12)</li>
          <li><strong>Select Domino:</strong> Choose a domino from your hand</li>
          <li><strong>Match & Place:</strong> Place it so one of its faces + an adjacent face on the board = your dice sum</li>
        </ol>
      `,
      highlightSelector: '.sd-dice-area',
      position: 'bottom',
      requiredAction: {
        type: 'click',
        selector: '.sd-roll-btn',
      },
    },
    {
      id: 'matching-rules',
      title: 'Matching Rules',
      message: `
        <ul>
          <li>Your domino must connect to an existing domino on the board</li>
          <li>A number on your tile plus a touching number on the board must equal the dice total</li>
          <li>Example: You rolled 8. Your tile has a 3. Put that 3 next to a 5 on the board, because 3 + 5 = 8</li>
        </ul>
      `,
      highlightSelector: '.sd-board',
      position: 'top',
    },
    {
      id: 'passing',
      title: 'Passing',
      message: `
        <ul>
          <li>If you cannot play any domino, you must pass</li>
          <li>If both players pass consecutively, the game ends</li>
          <li>The player with fewer dots left on the tiles still in hand wins</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Try to play tiles with lots of dots first</li>
          <li>Watch which sums the dice often make</li>
          <li>7 is the most common dice sum</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Sum Dominoes & Dice!</p>
        <p>Click <strong>Finish</strong> and clear your hand!</p>
      `,
      position: 'center',
    },
  ],
};
