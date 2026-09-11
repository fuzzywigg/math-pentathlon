// Tutorial content for Pent'Em In
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const pentEmInTutorial: TutorialConfig = {
  id: 'pent-em-in-basics',
  name: "Learn Pent'Em In",
  steps: [
    {
      id: 'welcome',
      title: "Welcome to Pent'Em In!",
      message: `
        <p>Let's learn how to play <strong>Pent'Em In</strong>!</p>
        <p>Trap your opponent so they can't place any more pieces!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Trap your opponent so they can't place any more pieces!</p>
      `,
      position: 'center',
    },
    {
      id: 'setup',
      title: 'Setup',
      message: `
        <ul>
          <li>10x10 grid board</li>
          <li>Each player has 12 pentomino pieces (5-cell shapes)</li>
        </ul>
      `,
      highlightSelector: '.pent-board',
      position: 'top',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Select:</strong> Choose a piece from your bank</li>
          <li><strong>Rotate/Flip:</strong> Adjust orientation if needed</li>
          <li><strong>Place:</strong> Put piece on empty board cells</li>
        </ol>
      `,
      highlightSelector: '.pent-piece-selector',
      position: 'bottom',
    },
    {
      id: 'rules',
      title: 'Rules',
      message: `
        <ul>
          <li>Pieces cannot overlap</li>
          <li>All 5 cells must fit on the board</li>
          <li>Pieces stay where placed</li>
        </ul>
      `,
      highlightSelector: '.pent-board',
      position: 'top',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>When your opponent cannot place any of their remaining pieces, you win!</p>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Control the center early</li>
          <li>Leave awkward spaces for your opponent</li>
          <li>Save flexible pieces for later</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Pent'Em In!</p>
        <p>Click <strong>Finish</strong> and trap your opponent!</p>
      `,
      position: 'center',
    },
  ],
};
