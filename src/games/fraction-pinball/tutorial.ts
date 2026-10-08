// Tutorial content for Fraction Pinball
// Next-only steps ported from existing How-to / helpContentHtml

import type { TutorialConfig } from '../../core/tutorial';

export const fractionPinballTutorial: TutorialConfig = {
  id: 'fraction-pinball-basics',
  name: 'Learn Fraction Pinball',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Fraction Pinball!',
      message: `
        <p>Let's learn how to play <strong>Fraction Pinball</strong>!</p>
        <p>Get points by matching fractions and decimals!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Get points by matching fractions and decimals!</p>
      `,
      position: 'center',
    },
    {
      id: 'gameplay',
      title: 'Gameplay',
      message: `
        <ul>
          <li>On your turn, change a fraction into a decimal, or a decimal into a fraction</li>
          <li>A right answer hits a pinball target and adds points</li>
          <li>A wrong answer costs you one ball</li>
        </ul>
      `,
      highlightSelector: '.pinball-challenge',
      position: 'bottom',
    },
    {
      id: 'scoring',
      title: 'Scoring',
      message: `
        <p>Different targets award different points: 10, 20, 30, 50, or 100!</p>
      `,
      highlightSelector: '.pinball-board',
      position: 'top',
    },
    {
      id: 'common-conversions',
      title: 'Common Conversions',
      message: `
        <ul>
          <li>1/2 = 0.5</li>
          <li>1/4 = 0.25, 3/4 = 0.75</li>
          <li>1/5 = 0.2, 2/5 = 0.4</li>
          <li>1/8 = 0.125</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>The player with the most points after all rounds wins!</p>
      `,
      highlightSelector: '.pinball-scores',
      position: 'bottom',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Fraction Pinball!</p>
        <p>Click <strong>Finish</strong> and hit those targets!</p>
      `,
      position: 'center',
    },
  ],
};
