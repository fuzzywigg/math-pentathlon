// Tutorial content for Sum Dominoes & Dice
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

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
    },
    {
      id: 'matching-rules',
      title: 'Matching Rules',
      message: `
        <ul>
          <li>Your domino must connect to an existing domino on the board</li>
          <li>The face touching must create the rolled sum</li>
          <li>Example: You rolled 8. Place [3|5] next to a [5|2] so 3+5=8</li>
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
          <li>Player with fewer total pips on remaining dominoes wins</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Try to play high-pip dominoes first</li>
          <li>Watch which sums are likely based on dice probabilities</li>
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
