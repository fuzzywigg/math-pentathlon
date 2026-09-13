// Tutorial content for Contig 60
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const contig60Tutorial: TutorialConfig = {
  id: 'contig-60-basics',
  name: 'Learn Contig 60',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Contig 60!',
      message: `
        <p>Let's learn how to play <strong>Contig 60</strong>!</p>
        <p>Score the most points by placing chips on the board adjacent to other chips!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Score the most points by placing chips on the board adjacent to other chips!</p>
      `,
      position: 'center',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Roll:</strong> Roll three dice</li>
          <li><strong>Calculate:</strong> Use all three numbers with +, -, ×, ÷ to make a result</li>
          <li><strong>Place:</strong> Put your chip on that number on the board</li>
        </ol>
      `,
      highlightSelector: '.contig-dice-area',
      position: 'bottom',
      requiredAction: {
        type: 'click',
        selector: '.contig-roll-btn',
      },
    },
    {
      id: 'scoring',
      title: 'Scoring',
      message: `
        <ul>
          <li>Score <strong>1 point</strong> for each adjacent chip already on the board</li>
          <li>Adjacent means touching horizontally, vertically, or diagonally</li>
          <li>Maximum 8 points per placement (surrounded on all sides)</li>
        </ul>
      `,
      highlightSelector: '.contig-board',
      position: 'top',
    },
    {
      id: 'expression-rules',
      title: 'Expression Rules',
      message: `
        <ul>
          <li>You must use <strong>all three dice</strong></li>
          <li>You can use <strong>any two operations</strong> (can repeat)</li>
          <li>Operations: + (add), - (subtract), × (multiply), ÷ (divide)</li>
          <li>Division must result in a whole number</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'passing',
      title: 'Passing',
      message: `
        <ul>
          <li>If you cannot make any available number, you must pass</li>
          <li>Three consecutive passes eliminates you from the game</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <ul>
          <li><strong>5 in a row:</strong> First to get 5 chips in a line wins!</li>
          <li><strong>By points:</strong> When board is full, highest score wins</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Contig 60!</p>
        <p>Click <strong>Finish</strong> and start scoring!</p>
      `,
      position: 'center',
    },
  ],
};
