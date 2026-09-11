// Tutorial content for Frac Fact
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const fracFactTutorial: TutorialConfig = {
  id: 'frac-fact-basics',
  name: 'Learn Frac Fact',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Frac Fact!',
      message: `
        <p>Let's learn how to play <strong>Frac Fact</strong>!</p>
        <p>Score more points than your opponent by correctly solving fraction problems!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Score more points than your opponent by correctly solving fraction problems!</p>
      `,
      position: 'center',
    },
    {
      id: 'gameplay',
      title: 'Gameplay',
      message: `
        <ul>
          <li>Players take turns solving fraction arithmetic problems</li>
          <li>Choose the correct answer from 4 options</li>
          <li>Earn points for correct answers</li>
          <li>Build streaks for bonus points!</li>
        </ul>
      `,
      highlightSelector: '.frac-problem',
      position: 'bottom',
    },
    {
      id: 'scoring',
      title: 'Scoring',
      message: `
        <ul>
          <li><strong>Correct answer:</strong> 10 points</li>
          <li><strong>Streak bonus:</strong> +5 points per consecutive correct answer</li>
        </ul>
      `,
      highlightSelector: '.frac-scores',
      position: 'bottom',
    },
    {
      id: 'difficulty-levels',
      title: 'Difficulty Levels',
      message: `
        <ul>
          <li><strong>Easy:</strong> Addition and subtraction with simple fractions</li>
          <li><strong>Medium:</strong> Includes multiplication</li>
          <li><strong>Hard:</strong> All operations including division</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>After 10 problems each, the player with the highest score wins!</p>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Frac Fact!</p>
        <p>Click <strong>Finish</strong> and solve those fractions!</p>
      `,
      position: 'center',
    },
  ],
};
