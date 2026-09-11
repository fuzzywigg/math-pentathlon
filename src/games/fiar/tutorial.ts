// Tutorial content for FIAR (Four In A Row)
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const fiarTutorial: TutorialConfig = {
  id: 'fiar-basics',
  name: 'Learn FIAR',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to FIAR!',
      message: `
        <p>Let's learn how to play <strong>FIAR (Four In A Row)</strong>!</p>
        <p>Get four of your chips in a row along connected pathways!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Get four of your chips in a row along connected pathways!</p>
      `,
      position: 'center',
    },
    {
      id: 'game-phases',
      title: 'Game Phases',
      message: `
        <ol>
          <li><strong>Placement Phase:</strong> Take turns placing 4 chips each on any empty node</li>
          <li><strong>Movement Phase:</strong> Take turns moving your chips along pathways</li>
        </ol>
      `,
      highlightSelector: '.fiar-board-container',
      position: 'bottom',
    },
    {
      id: 'movement-rules',
      title: 'Movement Rules',
      message: `
        <ul>
          <li>Chips move along the connected pathways (lines)</li>
          <li>Move any distance in a straight line</li>
          <li>Cannot jump over other chips</li>
          <li>Click your chip to select, then click destination</li>
        </ul>
      `,
      highlightSelector: '.fiar-board-container',
      position: 'bottom',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <ul>
          <li>Form 4 chips in a row along connected pathways</li>
          <li>Rows can be horizontal, vertical, or diagonal</li>
          <li><strong>Blocking:</strong> An opponent chip adjacent to your 4-in-a-row prevents the win!</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Block opponent's potential winning paths</li>
          <li>Set up multiple winning threats</li>
          <li>Control the center of the board</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play FIAR!</p>
        <p>Click <strong>Finish</strong> and get four in a row!</p>
      `,
      position: 'center',
    },
  ],
};
