// Tutorial content for Calla
// Division I (Grades K-1) - Simple language for young learners

import { TutorialConfig } from '../../core/tutorial';

export const callaTutorial: TutorialConfig = {
  id: 'calla-basics',
  name: 'Learn Calla',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Calla!',
      message: `
        <p>Let's learn how to play <strong>Calla</strong>!</p>
        <p>It's a fun counting game where you move cubes around the board!</p>
      `,
      position: 'center',
    },
    {
      id: 'goal',
      title: 'How to Win',
      message: `
        <p>The goal is to get the <strong>most cubes in your Calla</strong> (your big cup)!</p>
        <p>The game ends when all cubes are collected.</p>
      `,
      position: 'center',
    },
    {
      id: 'board-intro',
      title: 'The Game Board',
      message: `
        <p>The board has two rows of pits (cups).</p>
        <p><span style="color: #2196F3">Blue's pits</span> are on top.</p>
        <p><span style="color: #e53935">Red's pits</span> are on the bottom.</p>
        <p>Each player has a <strong>Calla</strong> (big cup) on their right side!</p>
      `,
      highlightSelector: '.calla-board',
      position: 'bottom',
    },
    {
      id: 'pits-explained',
      title: 'The Pits',
      message: `
        <p>Each pit starts with <strong>3 cubes</strong>.</p>
        <p>You'll pick up cubes from YOUR pits and drop them around the board!</p>
      `,
      highlightSelector: '.player-pits',
      position: 'top',
    },
    {
      id: 'how-to-move',
      title: 'Making a Move',
      message: `
        <p>On your turn:</p>
        <ol>
          <li><strong>Click a pit</strong> on YOUR side</li>
          <li><strong>Cubes get picked up</strong> from that pit</li>
          <li><strong>Drop 1 cube</strong> in each pit going counter-clockwise</li>
        </ol>
        <p>It's like walking around and giving out one cube at a time!</p>
      `,
      position: 'center',
    },
    {
      id: 'your-calla',
      title: 'Your Calla',
      message: `
        <p>When passing YOUR Calla, you drop a cube in it too!</p>
        <p>Cubes in your Calla stay there - that's your score!</p>
        <p>(You skip over your opponent's Calla)</p>
      `,
      highlightSelector: '.calla-store',
      position: 'left',
    },
    {
      id: 'free-turn',
      title: 'Free Turn!',
      message: `
        <p><strong>Special rule:</strong> If your last cube lands in your Calla, you get another turn!</p>
        <p>Try to plan moves that land in your Calla!</p>
      `,
      position: 'center',
    },
    {
      id: 'capture',
      title: 'Capturing',
      message: `
        <p><strong>Another special rule:</strong></p>
        <p>If your last cube lands in an <strong>empty pit on YOUR side</strong>,
        AND the pit across from it has cubes...</p>
        <p>You capture ALL those cubes into your Calla!</p>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tip',
      title: 'Strategy',
      message: `
        <p><strong>Tips for winning:</strong></p>
        <ul>
          <li>Count ahead to land in your Calla!</li>
          <li>Look for capture opportunities</li>
          <li>Watch your opponent's side too!</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Calla!</p>
        <p>Click <strong>Finish</strong> and start collecting cubes!</p>
        <p>Good luck! 🧊</p>
      `,
      position: 'center',
    },
  ],
};
