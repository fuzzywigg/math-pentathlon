// Tutorial content for Remainder Islands
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const remainderIslandsTutorial: TutorialConfig = {
  id: 'remainder-islands-basics',
  name: 'Learn Remainder Islands',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Remainder Islands!',
      message: `
        <p>Let's learn how to play <strong>Remainder Islands</strong>!</p>
        <p>Score the most points by strategically placing chips on islands using division remainders!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Score the most points by strategically placing chips on islands using division remainders!</p>
      `,
      position: 'center',
    },
    {
      id: 'gameplay',
      title: 'Gameplay',
      message: `
        <ol>
          <li><strong>Roll:</strong> Roll two dice to get your total</li>
          <li><strong>Divide:</strong> Choose an island and divide your total by its value</li>
          <li><strong>Score:</strong> Earn points equal to the remainder</li>
        </ol>
      `,
      highlightSelector: '.remainder-dice',
      position: 'bottom',
    },
    {
      id: 'example',
      title: 'Example',
      message: `
        <p>Roll 7, choose island with value 3: 7 ÷ 3 = 2 R1 → Score 1 point</p>
      `,
      highlightSelector: '.remainder-board',
      position: 'top',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Choose islands that give the highest remainder</li>
          <li>Claim islands to block your opponent</li>
          <li>Remember: higher divisors can give higher remainders!</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>After all turns, the player with the most points wins!</p>
      `,
      highlightSelector: '.remainder-scores',
      position: 'bottom',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Remainder Islands!</p>
        <p>Click <strong>Finish</strong> and chase those remainders!</p>
      `,
      position: 'center',
    },
  ],
};
