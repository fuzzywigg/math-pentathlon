// Tutorial content for Classic Hex
// Division I — Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const hexTutorial: TutorialConfig = {
  id: 'hex-basics',
  name: 'Learn Hex',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Hex!',
      message: `
        <p>Let's learn how to play <strong>Hex</strong>!</p>
        <p>Connect your two opposite sides of the board with an unbroken chain of your pieces.</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Connect your two opposite sides of the board with an unbroken chain of your pieces.</p>
      `,
      position: 'center',
    },
    {
      id: 'players',
      title: 'Players',
      message: `
        <ul>
          <li><strong>Blue</strong> connects <strong>top to bottom</strong></li>
          <li><strong>Red</strong> connects <strong>left to right</strong></li>
        </ul>
      `,
      highlightSelector: '.hex-legend',
      position: 'top',
    },
    {
      id: 'board-intro',
      title: 'The Game Board',
      message: `
        <p>This is the hex board.</p>
        <p><strong>Blue</strong> connects <strong>top to bottom</strong>.
        <strong>Red</strong> connects <strong>left to right</strong>.</p>
      `,
      highlightSelector: '.hex-board',
      position: 'right',
    },
    {
      id: 'gameplay',
      title: 'Gameplay',
      message: `
        <ol>
          <li>Blue goes first</li>
          <li>On your turn, click any empty hex to place your piece</li>
          <li>Pieces cannot be moved once placed</li>
        </ol>
      `,
      highlightSelector: '.hex-board',
      position: 'bottom',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>Create an unbroken path of your pieces connecting your two edges.
        Hex is a solved game - there are no draws possible!</p>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Control the center of the board</li>
          <li>Create "bridges" - two pieces that can connect via two paths</li>
          <li>Block your opponent while building your own path</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Hex!</p>
        <p>Click <strong>Finish</strong> and connect your sides!</p>
      `,
      position: 'center',
    },
  ],
};
