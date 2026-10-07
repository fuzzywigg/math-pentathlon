// Tutorial content for Kings & Quadraphages

import { TutorialConfig } from '../../core/tutorial';

export const kingsQuadraphagesTutorial: TutorialConfig = {
  id: 'kings-quadraphages-basics',
  name: 'Learn Kings & Quadraphages',
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Kings & Quadraphages!',
      message: `
        <p>This game is about trapping the other player's King.</p>
        <p>Let's learn how to play Kings & Quadraphages!</p>
      `,
      position: 'center',
    },
    {
      id: 'objective',
      title: 'Game Objective',
      message: `
        <p>Your goal is to <strong>trap your opponent's King</strong> so it cannot move
        to any square next to it (including corners).</p>
        <p>The player who traps the other King wins!</p>
      `,
      position: 'center',
    },
    {
      id: 'board-intro',
      title: 'The Game Board',
      message: `
        <p>The game is played on a 9&times;9 board.</p>
        <p>Notice the two Kings: <span style="color: #2196F3">Blue (Player 1)</span> at the top
        and <span style="color: #e53935">Red (Player 2)</span> at the bottom.</p>
      `,
      highlightSelector: '.board',
      position: 'right',
    },
    {
      id: 'your-king',
      title: 'Your King',
      message: `
        <p>This is <span style="color: #2196F3">Player 1's King</span> (Blue).</p>
        <p>You'll start as Player 1. Your King begins at the top center of the board.</p>
      `,
      highlightSelector: '.cell[data-row="1"][data-col="5"]',
      position: 'left',
    },
    {
      id: 'opponent-king',
      title: "Opponent's King",
      message: `
        <p>This is <span style="color: #e53935">Player 2's King</span> (Red).</p>
        <p>Your opponent's King starts at the bottom center.</p>
      `,
      highlightSelector: '.cell[data-row="9"][data-col="5"]',
      position: 'top',
    },
    {
      id: 'turn-structure',
      title: 'Turn Structure',
      message: `
        <p>Each turn has <strong>two parts</strong>:</p>
        <ol>
          <li><strong>Move your King</strong> - one square in any direction</li>
          <li><strong>Place a Quadraphage</strong> - a blocker on any empty square</li>
        </ol>
        <p>You must complete both actions every turn!</p>
      `,
      position: 'center',
    },
    {
      id: 'select-king',
      title: 'Step 1: Select Your King',
      message: `
        <p>Let's practice! Look for the yellow <strong>Tap here</strong> cue
        and <strong>tap your Blue King</strong>.</p>
        <p>The King will glow gold when selected.</p>
      `,
      highlightSelector: '.cell[data-row="1"][data-col="5"]',
      position: 'bottom',
      requiredAction: {
        type: 'click-cell',
        row: 1,
        col: 5,
      },
    },
    {
      id: 'valid-moves',
      title: 'Valid Moves',
      message: `
        <p>Great! See the <span style="color: green">green highlighted cells</span>?
        These show where your King can move.</p>
        <p>Kings move one square in any direction
        (across, up and down, or diagonally).</p>
      `,
      highlightSelector: '.board',
      position: 'right',
    },
    {
      id: 'move-king',
      title: 'Move Your King',
      message: `
        <p>Now look for <strong>Tap here</strong> and tap the green cell
        directly below your King.</p>
        <p>That moves your King one square down.</p>
      `,
      highlightSelector: '.cell[data-row="2"][data-col="5"]',
      position: 'bottom',
      requiredAction: {
        type: 'click-cell',
        row: 2,
        col: 5,
      },
    },
    {
      id: 'place-quadraphage-intro',
      title: 'Step 2: Place a Quadraphage',
      message: `
        <p>Excellent move! Now you need to <strong>place a Quadraphage</strong>.</p>
        <p>Quadraphages are blockers. Once placed, they stay on the board forever
        and block all movement through that square.</p>
      `,
      position: 'center',
    },
    {
      id: 'place-quadraphage',
      title: 'Place Your Quadraphage',
      message: `
        <p><strong>Click on any empty cell</strong> to place your Quadraphage.</p>
        <p>Hint: Place blockers so the other King has fewer ways to move!</p>
      `,
      highlightSelector: '.board',
      position: 'right',
    },
    {
      id: 'turn-complete',
      title: 'Turn Complete!',
      message: `
        <p>You've completed your turn! Now it's Player 2's turn.</p>
        <p>In a real game, your opponent would now move their King and place a Quadraphage.</p>
      `,
      position: 'center',
    },
    {
      id: 'supplies',
      title: 'Quadraphage Supplies',
      message: `
        <p>Each player starts with <strong>30 Quadraphages</strong>.</p>
        <p>The supply counts are shown here. You place one each turn,
        so plan your strategy carefully!</p>
      `,
      highlightSelector: '.status-supplies',
      position: 'bottom',
    },
    {
      id: 'winning',
      title: 'How to Win',
      message: `
        <p>You win when your opponent's King has <strong>nowhere safe to move</strong>
        at the start of their turn.</p>
        <p>This happens when all 8 squares around their King are either:</p>
        <ul>
          <li>Off the board (edge/corner)</li>
          <li>Occupied by a Quadraphage</li>
          <li>Occupied by your King</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'strategy-tips',
      title: 'Strategy Tips',
      message: `
        <p><strong>Beginner tips:</strong></p>
        <ul>
          <li>Try to push your opponent toward a corner or edge</li>
          <li>Place Quadraphages to cut off escape routes</li>
          <li>Keep your own King away from edges</li>
          <li>Think ahead - where will both Kings be in 2-3 moves?</li>
        </ul>
      `,
      position: 'center',
    },
    {
      id: 'move-history',
      title: 'Move History',
      message: `
        <p>The move history panel shows all moves made in the game.</p>
        <p>You can collapse it by clicking the toggle if you need more space.</p>
      `,
      highlightSelector: '#move-history',
      position: 'right',
    },
    {
      id: 'complete',
      title: 'Tutorial Complete!',
      message: `
        <p>Congratulations! You now know how to play Kings & Quadraphages!</p>
        <p>Click <strong>Finish</strong> to start playing. You can always
        click "How to Play" to review the rules.</p>
        <p>Good luck and have fun! 🎉</p>
      `,
      position: 'center',
    },
  ],
};
