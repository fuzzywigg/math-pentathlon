// Tutorial content for Ramrod
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const ramrodTutorial: TutorialConfig = {
  id: 'ramrod-basics',
  name: 'Learn Ramrod',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Ramrod!',
      message: `
        <p>Let's learn how to play <strong>Ramrod</strong>!</p>
        <p>Be the first player to capture 24 cm worth of sum boxes!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Be the first player to capture 24 cm worth of sum boxes!</p>
      `,
      position: 'center',
    },
    {
      id: 'cuisenaire-rods',
      title: 'Cuisenaire Rods',
      message: `
        <p>Each rod has a color and length (1-10 cm):</p>
        <ul>
          <li><strong>White</strong> = 1cm, <strong>Red</strong> = 2cm</li>
          <li><strong>Light Green</strong> = 3cm, <strong>Purple</strong> = 4cm</li>
          <li><strong>Yellow</strong> = 5cm, <strong>Dark Green</strong> = 6cm</li>
          <li><strong>Black</strong> = 7cm, <strong>Brown</strong> = 8cm</li>
          <li><strong>Blue</strong> = 9cm, <strong>Orange</strong> = 10cm</li>
        </ul>
      `,
      highlightSelector: '.ramrod-player-rods',
      position: 'bottom',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Select Rod:</strong> Choose a rod from your collection</li>
          <li><strong>Place Rod:</strong> Put it in an empty slot on a sum box</li>
          <li><strong>Capture:</strong> When two rods in a box equal the target sum, you capture it!</li>
        </ol>
      `,
      highlightSelector: '.ramrod-board',
      position: 'bottom',
    },
    {
      id: 'capturing-rules',
      title: 'Capturing Rules',
      message: `
        <ul>
          <li>Each sum box has a target value (5-10)</li>
          <li>Place two rods that add up to the target sum</li>
          <li>You capture the box and score its cm value</li>
        </ul>
      `,
      highlightSelector: '.ramrod-board',
      position: 'top',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>First player to capture 24 cm worth of boxes wins!</p>
      `,
      highlightSelector: '.ramrod-scores',
      position: 'bottom',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Set up captures for yourself</li>
          <li>Block opponent's potential captures</li>
          <li>Higher value boxes are worth more!</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Ramrod!</p>
        <p>Click <strong>Finish</strong> and capture 24 cm!</p>
      `,
      position: 'center',
    },
  ],
};
