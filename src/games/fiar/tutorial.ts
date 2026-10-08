// Tutorial content for FIAR (Four In A Row) — Division II rules

import type { TutorialConfig } from '../../core/tutorial';

export const fiarTutorial: TutorialConfig = {
  id: 'fiar-basics',
  name: 'Learn FIAR',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to FIAR!',
      message: `
        <p>Let's learn how to play <strong>FIAR (Four In A Row)</strong>!</p>
        <p>Get four chips of the same color in a row along connected pathways — gaps are OK!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Identify four (or more) chips of the same color along a straight line of connected spaces, with no opposite-color chip between them.</p>
        <p>Empty spaces between your four are fine. The path cannot cross the yellow center diamond.</p>
      `,
      position: 'center',
    },
    {
      id: 'game-phases',
      title: 'Game Phases',
      message: `
        <ol>
          <li><strong>Placement Phase:</strong> Take turns placing 7 chips each on any empty node (2 of yours are marked Fire Extinguishers)</li>
          <li><strong>Movement Phase:</strong> Take turns moving your chips along pathways</li>
        </ol>
      `,
      highlightSelector: '.fiar-board-container',
      position: 'bottom',
    },
    {
      id: 'marked-chips',
      title: 'Marked Chips (Fire Extinguisher)',
      message: `
        <ul>
          <li>Each player has <strong>2 marked chips</strong> (Fire Extinguisher blockers)</li>
          <li>Only an opponent's <strong>marked</strong> chip next to a winning path blocks that win</li>
          <li>Your own marked chips can be part of a winning path</li>
          <li>Choose plain or marked before each placement</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'movement-rules',
      title: 'Movement Rules',
      message: `
        <ul>
          <li>Chips move along the connected pathways (lines)</li>
          <li>Move any distance in a straight line</li>
          <li>Cannot jump over other chips</li>
          <li>Cannot move across the yellow center</li>
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
          <li>Form 4 chips in a row along connected pathways (gaps OK)</li>
          <li>Rows can be horizontal, vertical, or diagonal</li>
          <li>You can win during placement or movement</li>
          <li>You can win with the opponent's color if your move completes their line</li>
          <li><strong>Blocking:</strong> Only an opponent's marked Fire Extinguisher chip adjacent to the path prevents the win</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Save marked chips to block opponent paths</li>
          <li>Set up multiple winning threats (including gapped lines)</li>
          <li>Watch for wins in either color after every move</li>
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
