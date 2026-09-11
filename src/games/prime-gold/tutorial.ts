// Tutorial content for Prime Gold
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const primeGoldTutorial: TutorialConfig = {
  id: 'prime-gold-basics',
  name: 'Learn Prime Gold',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Prime Gold!',
      message: `
        <p>Let's learn how to play <strong>Prime Gold</strong>!</p>
        <p>Form 4 diagonal veins of prime numbers to win!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Form 4 diagonal veins of prime numbers to win!</p>
      `,
      position: 'center',
    },
    {
      id: 'the-board',
      title: 'The Board',
      message: `
        <ul>
          <li>7x7 grid with numbers spiraling from center</li>
          <li>Gold cells are prime numbers</li>
          <li>Primes naturally occur along diagonals</li>
        </ul>
      `,
      highlightSelector: '.pg-board',
      position: 'top',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Roll Dice:</strong> Roll 3 dice (d6, d8, d10)</li>
          <li><strong>Create Expression:</strong> Combine dice using +, -, *, /, ^, !</li>
          <li><strong>Place Chip:</strong> Put chip on the matching number</li>
        </ol>
      `,
      highlightSelector: '.pg-dice-area',
      position: 'bottom',
    },
    {
      id: 'operations',
      title: 'Operations',
      message: `
        <ul>
          <li><strong>Basic:</strong> +, -, ×, ÷</li>
          <li><strong>Exponents:</strong> a^b (e.g., 2^3 = 8)</li>
          <li><strong>Factorials:</strong> n! (e.g., 4! = 24)</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'prime-veins',
      title: 'Prime Veins',
      message: `
        <ul>
          <li>A vein = 4+ chips in a diagonal line</li>
          <li>Chips must be on prime numbers</li>
          <li>First to 4 veins wins!</li>
        </ul>
      `,
      highlightSelector: '.pg-scores',
      position: 'bottom',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Target prime numbers (gold cells)</li>
          <li>Build along diagonal lines</li>
          <li>Block opponent's potential veins</li>
          <li>Factorials give big numbers: 5!=120</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Prime Gold!</p>
        <p>Click <strong>Finish</strong> and form those prime veins!</p>
      `,
      position: 'center',
    },
  ],
};
