// Tutorial content for Juggle
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const juggleTutorial: TutorialConfig = {
  id: 'juggle-basics',
  name: 'Learn Juggle',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Juggle!',
      message: `
        <p>Let's learn how to play <strong>Juggle</strong>!</p>
        <p>Be the first player to completely fill your 9x9 grid with polyomino shapes!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Be the first player to completely fill your 9x9 grid with polyomino shapes!</p>
      `,
      position: 'center',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Roll:</strong> Roll two dice</li>
          <li><strong>Choose:</strong> Pick one die - its value determines your shape category</li>
          <li><strong>Select:</strong> Choose a specific shape from that category</li>
          <li><strong>Place:</strong> Position and place the shape on your board</li>
        </ol>
      `,
      highlightSelector: '.juggle-dice-area',
      position: 'bottom',
    },
    {
      id: 'dice-values',
      title: 'Dice Values',
      message: `
        <ul>
          <li><strong>1</strong> = Monomino (1 cell)</li>
          <li><strong>2</strong> = Domino (2 cells)</li>
          <li><strong>3</strong> = Tromino (3 cells)</li>
          <li><strong>4</strong> = Tetromino (4 cells)</li>
          <li><strong>5-6</strong> = Pentomino (5 cells)</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'placement-rules',
      title: 'Placement Rules',
      message: `
        <ul>
          <li>Shapes can be rotated and flipped</li>
          <li>Shapes must fit entirely within your 9x9 grid</li>
          <li>Shapes cannot overlap with previously placed shapes</li>
        </ul>
      `,
      highlightSelector: '.juggle-boards',
      position: 'top',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Larger shapes fill the board faster</li>
          <li>Save small shapes for filling gaps</li>
          <li>Plan ahead to avoid getting stuck</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Juggle!</p>
        <p>Click <strong>Finish</strong> and fill your grid!</p>
      `,
      position: 'center',
    },
  ],
};
