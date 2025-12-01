// Tutorial content for Star Track
// Division I (Grades K-1) - Simple language for young learners

import { TutorialConfig } from '../../core/tutorial';

export const starTrackTutorial: TutorialConfig = {
  id: 'star-track-basics',
  name: 'Learn Star Track',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Star Track!',
      message: `
        <p>Let's learn how to play <strong>Star Track</strong>!</p>
        <p>It's a fun racing game where you use chains to move along the track.</p>
      `,
      position: 'center',
    },
    {
      id: 'goal',
      title: 'How to Win',
      message: `
        <p>The goal is simple: <strong>reach the star in the center first!</strong></p>
        <p>You and your friend will race from opposite ends of the track.</p>
      `,
      position: 'center',
    },
    {
      id: 'track-intro',
      title: 'The Star Track',
      message: `
        <p>This is the track! See the path of circles?</p>
        <p><span style="color: #2196F3">Blue</span> starts on one side,
        <span style="color: #e53935">Red</span> starts on the other.</p>
        <p>Both race toward the <strong>star</strong> in the middle!</p>
      `,
      highlightSelector: '.star-track-board',
      position: 'bottom',
    },
    {
      id: 'chains-intro',
      title: 'Chain Links',
      message: `
        <p>You move by picking <strong>chain links</strong>!</p>
        <p>Chains come in different sizes: 1, 2, 3, 4, 5, or 6 links long.</p>
        <p>A longer chain moves you farther!</p>
      `,
      position: 'center',
    },
    {
      id: 'how-turn-works',
      title: 'Your Turn',
      message: `
        <p>On your turn:</p>
        <ol>
          <li><strong>Draw 2 chains</strong> from the bucket</li>
          <li><strong>Pick 1 chain</strong> to use</li>
          <li><strong>Move</strong> that many spaces!</li>
        </ol>
        <p>The chain you don't use goes back in the bucket.</p>
      `,
      position: 'center',
    },
    {
      id: 'draw-button',
      title: 'Drawing Chains',
      message: `
        <p>Click the <strong>"Draw Chains"</strong> button to pull 2 chains from the bucket.</p>
        <p>You'll see what lengths you got!</p>
      `,
      highlightSelector: '.draw-chains-btn',
      position: 'bottom',
    },
    {
      id: 'choose-chain',
      title: 'Choosing Your Chain',
      message: `
        <p>After drawing, you'll see your 2 chains.</p>
        <p>Click on the chain you want to use!</p>
        <p><strong>Tip:</strong> Bigger numbers move you farther toward the star!</p>
      `,
      highlightSelector: '.chain-options',
      position: 'bottom',
    },
    {
      id: 'strategy-tip',
      title: 'Strategy',
      message: `
        <p><strong>Tips for winning:</strong></p>
        <ul>
          <li>Usually pick the longer chain</li>
          <li>Watch how close your opponent is!</li>
          <li>Count your spaces to plan ahead</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Race!',
      message: `
        <p>That's all you need to know!</p>
        <p>Click <strong>Finish</strong> and race to the star!</p>
        <p>Good luck! ⭐</p>
      `,
      position: 'center',
    },
  ],
};
