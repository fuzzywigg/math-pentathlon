// Tutorial content for Kwatro-Sinko
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const kwatroSinkoTutorial: TutorialConfig = {
  id: 'kwatro-sinko-basics',
  name: 'Learn Kwatro-Sinko',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Kwatro-Sinko!',
      message: `
        <p>Let's learn how to play <strong>Kwatro-Sinko</strong>!</p>
        <p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>
      `,
      position: 'center',
    },
    {
      id: 'setup',
      title: 'Setup',
      message: `
        <ul>
          <li><strong>Blue (Player 1):</strong> Even chips (0, 2, 4, 6, 8)</li>
          <li><strong>Red (Player 2):</strong> Odd chips (1, 3, 5, 7, 9)</li>
        </ul>
      `,
      highlightSelector: '.kwa-chip-info',
      position: 'bottom',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Select Chip:</strong> Click one of your chips on the board</li>
          <li><strong>Move:</strong> Click a connected green space to move there</li>
        </ol>
      `,
      highlightSelector: '.kwa-board',
      position: 'bottom',
    },
    {
      id: 'movement-rules',
      title: 'Movement Rules',
      message: `
        <ul>
          <li>Chips move along the pathway connections</li>
          <li>You can only move to empty adjacent spaces</li>
          <li>Diagonal connections exist on numbered spaces</li>
        </ul>
      `,
      highlightSelector: '.kwa-board',
      position: 'top',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <ul>
          <li>Form 3 chips in a line (any direction)</li>
          <li>The alignment must satisfy: <strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong></li>
          <li>Example: 6 + 3 - 5 = 4 ✓</li>
          <li>Example: 8 + 1 - 4 = 5 ✓</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Control the center to maximize movement options</li>
          <li>Watch for potential winning combinations</li>
          <li>Block your opponent's alignments</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Kwatro-Sinko!</p>
        <p>Click <strong>Finish</strong> and make 4 or 5!</p>
      `,
      position: 'center',
    },
  ],
};
