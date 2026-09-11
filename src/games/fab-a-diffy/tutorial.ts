// Tutorial content for Fab-a-Diffy
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const fabADiffyTutorial: TutorialConfig = {
  id: 'fab-a-diffy-basics',
  name: 'Learn Fab-a-Diffy',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Fab-a-Diffy!',
      message: `
        <p>Let's learn how to play <strong>Fab-a-Diffy</strong>!</p>
        <p>Claim the most answer bars by combining fraction bars with operations!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Claim the most answer bars by combining fraction bars with operations!</p>
      `,
      position: 'center',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Select Bars:</strong> Choose two fraction bars from your pool</li>
          <li><strong>Choose Operation:</strong> Pick +, −, ×, or ÷</li>
          <li><strong>Match Answer:</strong> If the result matches an available answer bar, claim it!</li>
        </ol>
      `,
      highlightSelector: '.fab-bar-pool',
      position: 'bottom',
    },
    {
      id: 'operations',
      title: 'Operations',
      message: `
        <ul>
          <li><strong>+</strong> Add fractions</li>
          <li><strong>−</strong> Subtract fractions</li>
          <li><strong>×</strong> Multiply fractions</li>
          <li><strong>÷</strong> Divide fractions</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'rules',
      title: 'Rules',
      message: `
        <ul>
          <li>Each fraction bar can only be used once</li>
          <li>Results are automatically simplified</li>
          <li>Equivalent fractions match (e.g., 2/4 = 1/2)</li>
        </ul>
      `,
      highlightSelector: '.fab-answer-board',
      position: 'top',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>The player who claims the most answer bars when all bars are used wins!</p>
      `,
      highlightSelector: '.fab-scores',
      position: 'bottom',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Plan combinations that match multiple possible answers</li>
          <li>Block opponent's potential matches</li>
          <li>Save versatile fractions for later</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Fab-a-Diffy!</p>
        <p>Click <strong>Finish</strong> and claim those answer bars!</p>
      `,
      position: 'center',
    },
  ],
};
