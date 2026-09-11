// Tutorial content for Queens & Guards
// Next-only steps ported from existing How-to / helpContentHtml

import { TutorialConfig } from '../../core/tutorial';

export const queensGuardsTutorial: TutorialConfig = {
  id: 'queens-guards-basics',
  name: 'Learn Queens & Guards',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Queens & Guards!',
      message: `
        <p>Let's learn how to play <strong>Queens & Guards</strong>!</p>
        <p>Get your Queen to the center cell (throne) surrounded by all 6 of your Guards!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Objective',
      message: `
        <p>Get your Queen to the center cell (throne) surrounded by all 6 of your Guards!</p>
      `,
      position: 'center',
    },
    {
      id: 'setup',
      title: 'Setup',
      message: `
        <ul>
          <li>Each player has 1 Queen and 6 Guards</li>
          <li>Pieces start on the outer ring of the hexagonal board</li>
          <li>Blue starts on one side, Red on the opposite</li>
        </ul>
      `,
      highlightSelector: '.qg-board-container',
      position: 'bottom',
    },
    {
      id: 'movement-rules',
      title: 'Movement Rules',
      message: `
        <ul>
          <li>Click a piece to select it, then click a highlighted cell to move</li>
          <li>Pieces can only move <strong>inward</strong> (toward center) or <strong>sideways</strong> (same ring)</li>
          <li>Pieces cannot move outward (away from center)</li>
          <li>Only the Queen can occupy the center cell (throne)</li>
        </ul>
      `,
      highlightSelector: '.qg-board-container',
      position: 'bottom',
    },
    {
      id: 'capturing',
      title: 'Capturing',
      message: `
        <ul>
          <li>Sandwich an opponent's piece between two of yours to capture it</li>
          <li>Captured pieces must be relocated to the outer ring</li>
          <li>You cannot move into a position where you would be sandwiched</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'winning',
      title: 'Winning',
      message: `
        <p>Place your Queen on the center throne and surround it with all 6 of your Guards in the inner ring!</p>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <ul>
          <li>Protect your Queen while advancing toward the center</li>
          <li>Set up captures to slow your opponent</li>
          <li>Position guards strategically for the final winning formation</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Queens & Guards!</p>
        <p>Click <strong>Finish</strong> and claim the throne!</p>
      `,
      position: 'center',
    },
  ],
};
