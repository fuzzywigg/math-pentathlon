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
        <p>Be first to fill every square on your 9×9 board with shapes!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Be first to fill every square on your 9×9 board with shapes!</p>
      `,
      position: 'center',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Roll:</strong> Roll two dice</li>
          <li><strong>Choose:</strong> Pick one die — the number tells you what size shape you may use</li>
          <li><strong>Select:</strong> Choose one shape of that size</li>
          <li><strong>Place:</strong> Put the shape on your board</li>
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
          <li><strong>1</strong> = one square</li>
          <li><strong>2</strong> = two squares</li>
          <li><strong>3</strong> = three squares</li>
          <li><strong>4</strong> = four squares</li>
          <li><strong>5–6</strong> = five squares</li>
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
          <li>Shapes must fit entirely inside your 9×9 board</li>
          <li>Shapes cannot overlap shapes you already placed</li>
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
