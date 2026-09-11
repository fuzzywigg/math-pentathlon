// Tutorial content for Par 55
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const par55Tutorial: TutorialConfig = {
  id: 'par-55-basics',
  name: 'Learn Par 55',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Par 55!',
      message: `
        <p>Let's learn how to play <strong>Par 55</strong>!</p>
        <p>Be the first player to score 55 points by matching attributes on the board!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Be the first player to score 55 points by matching attributes on the board!</p>
      `,
      position: 'center',
    },
    {
      id: 'attribute-blocks',
      title: 'Attribute Blocks',
      message: `
        <p>Each block has 4 attributes:</p>
        <ul>
          <li><strong>Shape:</strong> Circle, Square, Triangle, Rectangle, or Hexagon</li>
          <li><strong>Color:</strong> Red, Blue, or Yellow</li>
          <li><strong>Size:</strong> Small or Large</li>
          <li><strong>Thickness:</strong> Thin or Thick</li>
        </ul>
      `,
      highlightSelector: '.par55-hand',
      position: 'bottom',
    },
    {
      id: 'turn-sequence',
      title: 'Turn Sequence',
      message: `
        <ol>
          <li><strong>Select Block:</strong> Choose a block from your hand (5 blocks)</li>
          <li><strong>Place Block:</strong> Put it on an empty base adjacent to occupied bases</li>
          <li><strong>Score Points:</strong> Earn 1 point for each matching attribute with adjacent blocks</li>
        </ol>
      `,
      highlightSelector: '.par55-board',
      position: 'top',
    },
    {
      id: 'scoring',
      title: 'Scoring',
      message: `
        <ul>
          <li>Compare your placed block to each adjacent block</li>
          <li>Score 1 point per matching attribute (max 4 per connection)</li>
          <li>Multiple adjacent blocks = multiple scoring opportunities!</li>
        </ul>
      `,
      highlightSelector: '.par55-scores',
      position: 'bottom',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>First player to reach 55 points wins! In case of a tie, the player who reaches 55 first wins.</p>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Place blocks near multiple occupied bases for more points</li>
          <li>Match as many attributes as possible</li>
          <li>Watch what blocks your opponent has played</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Par 55!</p>
        <p>Click <strong>Finish</strong> and aim for 55!</p>
      `,
      position: 'center',
    },
  ],
};
