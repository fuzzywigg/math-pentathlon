// Tutorial content for Hex-a-Gone!
// Division I (Grades K-1) - Simple language for young learners

import { TutorialConfig } from '../../core/tutorial';

export const hexAGoneTutorial: TutorialConfig = {
  id: 'hex-a-gone-basics',
  name: 'Learn Hex-a-Gone!',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Hex-a-Gone!',
      message: `
        <p>Let's learn how to play <strong>Hex-a-Gone!</strong></p>
        <p>It's a shape-fitting puzzle game where you fill up the board!</p>
      `,
      position: 'center',
    },
    {
      id: 'goal',
      title: 'How to Win',
      message: `
        <p>The goal is to be the <strong>last player who can place a shape</strong>.</p>
        <p>When the other player can't fit any more shapes, you win!</p>
      `,
      position: 'center',
    },
    {
      id: 'board-intro',
      title: 'The Game Board',
      message: `
        <p>This is the hex board! It's made of hexagon spaces.</p>
        <p>You and your friend take turns filling it with shapes!</p>
      `,
      highlightSelector: '.hex-board',
      position: 'right',
    },
    {
      id: 'shapes-intro',
      title: 'Pattern Blocks',
      message: `
        <p>You'll use these colorful shapes:</p>
        <ul>
          <li><span style="color: #FFD700">● Yellow Hexagons</span></li>
          <li><span style="color: #FF4444">● Red Trapezoids</span></li>
          <li><span style="color: #4169E1">● Blue Rhombuses</span></li>
          <li><span style="color: #32CD32">● Green Triangles</span></li>
          <li><span style="color: #FF8C00">● Orange Squares</span></li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'turn-structure',
      title: 'Your Turn',
      message: `
        <p>On your turn:</p>
        <ol>
          <li><strong>Pick 1 to 3 shapes</strong> (they must be different!)</li>
          <li><strong>Place them</strong> on the board</li>
        </ol>
        <p>More shapes = Riskier but fills the board faster!</p>
      `,
      position: 'center',
    },
    {
      id: 'select-shapes',
      title: 'Selecting Shapes',
      message: `
        <p>Look at the shape bank below the board.</p>
        <p>Click on 1, 2, or 3 <strong>different</strong> shapes to use this turn!</p>
      `,
      highlightSelector: '.shape-bank',
      position: 'top',
    },
    {
      id: 'place-shapes',
      title: 'Placing Shapes',
      message: `
        <p>After selecting, click on the board to place each shape.</p>
        <p>Shapes must fit in empty spaces!</p>
      `,
      highlightSelector: '.hex-board',
      position: 'bottom',
    },
    {
      id: 'strategy-tip',
      title: 'Strategy',
      message: `
        <p><strong>Tips for winning:</strong></p>
        <ul>
          <li>Try to leave awkward spaces for your opponent</li>
          <li>Big shapes are hard to fit later!</li>
          <li>Sometimes placing 1 shape is smarter than 3</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Play!',
      message: `
        <p>Now you know how to play Hex-a-Gone!</p>
        <p>Click <strong>Finish</strong> and try to be the last player standing!</p>
        <p>Have fun! 🎨</p>
      `,
      position: 'center',
    },
  ],
};
