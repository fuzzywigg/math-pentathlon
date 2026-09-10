import './style.css';
import './ui/styles/mobile-play-shell.css';
import {
  addRoute,
  initRouter,
  getCurrentPath,
  getPathParams,
  navigate,
} from './core/router';
import { owlSystem } from './core/owl';
import { owlComponent } from './ui/owl';
import { renderGameSelector } from './ui/game-selector';
import {
  mountGameShell,
  type AIDifficultyLevel,
} from './ui/components/game-shell';
import { getGameById } from './core/game-registry';
import {
  initGame as initKQGame,
  newGameVsHuman as kqNewGameVsHuman,
  newGameVsAI as kqNewGameVsAI,
  startTutorial,
} from './games/kings-quadraphages/game-controller';
import { AIDifficulty } from './games/kings-quadraphages/ai';
import {
  initGame as initHexGame,
  newGameVsHuman as hexNewGameVsHuman,
  newGameVsAI as hexNewGameVsAI,
} from './games/hex/game-controller';
import {
  initGame as initStarTrackGame,
  newGameVsHuman as starTrackNewGameVsHuman,
  newGameVsAI as starTrackNewGameVsAI,
  startTutorial as startStarTrackTutorial,
} from './games/star-track/game-controller';
import {
  initGame as initHexAGoneGame,
  newGameVsHuman as hexAGoneNewGameVsHuman,
  newGameVsAI as hexAGoneNewGameVsAI,
  startTutorial as startHexAGoneTutorial,
} from './games/hex-a-gone/game-controller';
import {
  initGame as initCallaGame,
  newGameVsHuman as callaNewGameVsHuman,
  newGameVsAI as callaNewGameVsAI,
  startTutorial as startCallaTutorial,
} from './games/calla/game-controller';
import {
  initGame as initFiarGame,
  newGameVsHuman as fiarNewGameVsHuman,
  newGameVsAI as fiarNewGameVsAI,
} from './games/fiar/game-controller';
import {
  initGame as initQGGame,
  newGameVsHuman as qgNewGameVsHuman,
  newGameVsAI as qgNewGameVsAI,
} from './games/queens-guards/game-controller';
import {
  initGame as initContigGame,
  newGameVsHuman as contigNewGameVsHuman,
  newGameVsAI as contigNewGameVsAI,
} from './games/contig-60/game-controller';
import {
  initGame as initJuggleGame,
  newGameVsHuman as juggleNewGameVsHuman,
  newGameVsAI as juggleNewGameVsAI,
} from './games/juggle/game-controller';
import {
  initGame as initFabGame,
  newGameVsHuman as fabNewGameVsHuman,
  newGameVsAI as fabNewGameVsAI,
} from './games/fab-a-diffy/game-controller';
import {
  initGame as initSDGame,
  newGameVsHuman as sdNewGameVsHuman,
  newGameVsAI as sdNewGameVsAI,
} from './games/sum-dominoes/game-controller';
import {
  initGame as initPar55Game,
  newGameVsHuman as par55NewGameVsHuman,
  newGameVsAI as par55NewGameVsAI,
} from './games/par-55/game-controller';
import {
  initGame as initRamrodGame,
  newGameVsHuman as ramrodNewGameVsHuman,
  newGameVsAI as ramrodNewGameVsAI,
} from './games/ramrod/game-controller';
import {
  initGame as initKwaGame,
  newGameVsHuman as kwaNewGameVsHuman,
  newGameVsAI as kwaNewGameVsAI,
} from './games/kwatro-sinko/game-controller';
import {
  initGame as initStarsGame,
  newGameVsHuman as starsNewGameVsHuman,
  newGameVsAI as starsNewGameVsAI,
} from './games/stars-bars/game-controller';
import {
  initGame as initPrimeGoldGame,
  newGameVsHuman as primeGoldNewGameVsHuman,
  newGameVsAI as primeGoldNewGameVsAI,
} from './games/prime-gold/game-controller';
import {
  initGame as initPentEmInGame,
  newGameVsHuman as pentNewGameVsHuman,
  newGameVsAI as pentNewGameVsAI,
} from './games/pent-em-in/game-controller';
import {
  initGame as initFracFactGame,
  newGameVsHuman as fracNewGameVsHuman,
  newGameVsAI as fracNewGameVsAI,
} from './games/frac-fact/game-controller';
import {
  initGame as initRemainderGame,
  newGameVsHuman as remainderNewGameVsHuman,
  newGameVsAI as remainderNewGameVsAI,
} from './games/remainder-islands/game-controller';
import {
  initGame as initPinballGame,
  newGameVsHuman as pinballNewGameVsHuman,
  newGameVsAI as pinballNewGameVsAI,
} from './games/fraction-pinball/game-controller';
import { renderDiceDemo } from './demos/dice-demo';
import { renderAlignmentDemo } from './demos/alignment-demo';
import { renderFractionDemo } from './demos/fraction-demo';
import { renderPolyominoDemo } from './demos/polyomino-demo';
import { renderGraphDemo } from './demos/graph-demo';
import { renderAttributeDemo } from './demos/attribute-demo';
import { renderExpressionDemo } from './demos/expression-demo';

// Get the app container
const appContainer = document.getElementById('app');

if (!appContainer) {
  throw new Error('App container not found');
}

// Store reference to cleanup functions
let currentCleanup: (() => void) | null = null;

// Cleanup previous view
function cleanup(): void {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
}

// Render the game selector (home page)
function renderHome(): void {
  cleanup();
  document.title = 'Math Pentathlon';
  renderGameSelector(appContainer!);
}

// Render a specific game
function renderGame(): void {
  cleanup();

  const path = getCurrentPath();
  const params = getPathParams('/game/:id', path);
  const gameId = params.id;

  const gameInfo = getGameById(gameId);

  if (!gameInfo || !gameInfo.available) {
    navigate('/');
    return;
  }

  document.title = `Math Pentathlon - ${gameInfo.name}`;

  // Render game-specific UI
  if (gameId === 'kings-quadraphages') {
    renderKingsQuadraphages();
  } else if (gameId === 'hex') {
    renderHex();
  } else if (gameId === 'star-track') {
    renderStarTrack();
  } else if (gameId === 'hex-a-gone') {
    renderHexAGone();
  } else if (gameId === 'calla') {
    renderCalla();
  } else if (gameId === 'fiar') {
    renderFiar();
  } else if (gameId === 'queens-guards') {
    renderQueensGuards();
  } else if (gameId === 'contig-60') {
    renderContig60();
  } else if (gameId === 'juggle') {
    renderJuggle();
  } else if (gameId === 'fab-a-diffy') {
    renderFabADiffy();
  } else if (gameId === 'sum-dominoes') {
    renderSumDominoes();
  } else if (gameId === 'par-55') {
    renderPar55();
  } else if (gameId === 'ramrod') {
    renderRamrod();
  } else if (gameId === 'kwatro-sinko') {
    renderKwatrasinko();
  } else if (gameId === 'stars-bars') {
    renderStarsBars();
  } else if (gameId === 'prime-gold') {
    renderPrimeGold();
  } else if (gameId === 'pent-em-in') {
    renderPentEmIn();
  } else if (gameId === 'frac-fact') {
    renderFracFact();
  } else if (gameId === 'remainder-islands') {
    renderRemainderIslands();
  } else if (gameId === 'fraction-pinball') {
    renderFractionPinball();
  }
}

// Render Kings & Quadraphages
function renderKingsQuadraphages(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Kings & Quadraphages',
    helpTitle: 'How to Play Kings & Quadraphages',
    helpContentHtml: `<h3>Objective</h3>
          <p>Trap your opponent's King so it cannot move to any adjacent cell.</p>

          <h3>Game Setup</h3>
          <ul>
            <li>Each player has 1 King and 30 Quadraphages</li>
            <li>Player 1 (Blue) starts at the top, Player 2 (Red) at the bottom</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Move your King:</strong> Click your King, then click an adjacent empty cell (any of the 8 surrounding cells)</li>
            <li><strong>Place a Quadraphage:</strong> Click any empty cell to place a blocker</li>
          </ol>

          <h3>Rules</h3>
          <ul>
            <li>Kings can move one cell in any direction (like chess)</li>
            <li>Kings cannot move onto Quadraphages or the other King</li>
            <li>Quadraphages stay where placed for the entire game</li>
            <li>You must complete both actions each turn</li>
          </ul>

          <h3>Winning</h3>
          <p>You win when your opponent's King has no valid moves at the start of their turn!</p>`,
    gameAreaClass: 'game-area',
    modeRadioName: 'game-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer opponent',
    showTutorial: true,
    showMoveHistory: true,
    showDifficulty: true,
    defaultMode: 'human-vs-ai',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode, difficulty) => {
      if (mode === 'human-vs-ai') {
        kqNewGameVsAI((difficulty ?? 'medium') as AIDifficulty, true);
      } else {
        kqNewGameVsHuman();
      }
    },
    onTutorial: () => startTutorial(),
  });

  if (shell.board && shell.status) {
    initKQGame(
      shell.board,
      shell.status,
      shell.historyContent || undefined,
      shell.newGameBtn || undefined
    );
  }

  currentCleanup = shell.cleanup;
}

// Render Hex
function renderHex(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Hex',
    helpTitle: 'How to Play Hex',
    helpContentHtml: `<h3>Objective</h3>
          <p>Connect your two opposite sides of the board with an unbroken chain of your pieces.</p>

          <h3>Players</h3>
          <ul>
            <li><strong>Blue</strong> connects <strong>top to bottom</strong></li>
            <li><strong>Red</strong> connects <strong>left to right</strong></li>
          </ul>

          <h3>Gameplay</h3>
          <ol>
            <li>Blue goes first</li>
            <li>On your turn, click any empty hex to place your piece</li>
            <li>Pieces cannot be moved once placed</li>
          </ol>

          <h3>Winning</h3>
          <p>Create an unbroken path of your pieces connecting your two edges.
          Hex is a solved game - there are no draws possible!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Control the center of the board</li>
            <li>Create "bridges" - two pieces that can connect via two paths</li>
            <li>Block your opponent while building your own path</li>
          </ul>`,
    gameAreaClass: 'hex-game-area',
    modeRadioName: 'hex-game-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer (basic)',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        hexNewGameVsAI();
      } else {
        hexNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initHexGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Star Track
function renderStarTrack(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Star Track',
    helpTitle: 'How to Play Star Track',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the first player to reach the center star!</p>

          <h3>Players</h3>
          <ul>
            <li><strong>Blue</strong> starts from the top</li>
            <li><strong>Red</strong> starts from the bottom</li>
          </ul>

          <h3>Gameplay</h3>
          <ol>
            <li><strong>Draw Chains:</strong> Tap <em>Draw Chains</em> once. You get <em>two chain options</em> (two different lengths) — not two moves.</li>
            <li><strong>Choose:</strong> Tap <em>one</em> of the two chains to use.</li>
            <li><strong>Move:</strong> Your piece advances by that chain's length. The unused chain goes back in the bucket.</li>
          </ol>

          <h3>Example Turn</h3>
          <div class="howto-example" aria-label="Illustrated example of one Star Track turn">
            <ol class="howto-example-steps">
              <li>
                <p class="howto-example-caption"><strong>1. Draw</strong> — tap the button once</p>
                <div class="howto-example-figure">
                  <span class="howto-chip howto-chip-action">🔗 Draw Chains</span>
                </div>
              </li>
              <li>
                <p class="howto-example-caption"><strong>2. See 2 choices</strong> — two chains appear (pick later, not both)</p>
                <div class="howto-example-figure howto-example-row">
                  <span class="howto-chain" aria-hidden="true">
                    <span class="howto-chain-links">○○○</span>
                    <span class="howto-chain-num">3</span>
                  </span>
                  <span class="howto-chain" aria-hidden="true">
                    <span class="howto-chain-links">○○○○○</span>
                    <span class="howto-chain-num">5</span>
                  </span>
                </div>
              </li>
              <li>
                <p class="howto-example-caption"><strong>3. Pick one</strong> — e.g. the longer chain (5)</p>
                <div class="howto-example-figure howto-example-row">
                  <span class="howto-chain howto-chain-dim" aria-hidden="true">
                    <span class="howto-chain-links">○○○</span>
                    <span class="howto-chain-num">3</span>
                  </span>
                  <span class="howto-arrow" aria-hidden="true">→</span>
                  <span class="howto-chain howto-chain-picked" aria-hidden="true">
                    <span class="howto-chain-links">○○○○○</span>
                    <span class="howto-chain-num">5</span>
                  </span>
                </div>
              </li>
              <li>
                <p class="howto-example-caption"><strong>4. Move</strong> — piece advances 5 spaces toward ★; the 3 goes back</p>
                <div class="howto-example-figure">
                  <svg class="howto-track-svg" viewBox="0 0 220 44" width="100%" height="44" role="img" aria-label="Piece moves five spaces toward the star">
                    <circle cx="16" cy="22" r="8" fill="#90caf9" stroke="#1565c0" stroke-width="2"/>
                    <circle cx="44" cy="22" r="8" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
                    <circle cx="72" cy="22" r="8" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
                    <circle cx="100" cy="22" r="8" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
                    <circle cx="128" cy="22" r="8" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
                    <circle cx="156" cy="22" r="8" fill="#2196F3" stroke="#0d47a1" stroke-width="2"/>
                    <text x="156" y="26" text-anchor="middle" font-size="10" fill="white" font-family="sans-serif">●</text>
                    <line x1="24" y1="22" x2="148" y2="22" stroke="#90caf9" stroke-width="2" stroke-dasharray="3 3"/>
                    <polygon points="200,22 184,14 184,30" fill="#FFD700" stroke="#f9a825" stroke-width="1"/>
                    <text x="200" y="26" text-anchor="middle" font-size="14">★</text>
                  </svg>
                </div>
              </li>
            </ol>
          </div>

          <h3>Chain Links</h3>
          <p>Chains have lengths from 1 to 6. The bucket contains multiple chains of each length.</p>
          <p>The chain you don't use goes back into the bucket.</p>

          <h3>Winning</h3>
          <p>First player to reach or pass space 12 (the center star) wins!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Longer chains move you faster</li>
            <li>Sometimes a shorter chain is better to land exactly on the goal</li>
            <li>Watch what chains have been used to predict what's left</li>
          </ul>`,
    gameAreaClass: 'star-track-game-area',
    modeRadioName: 'star-track-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Race against the computer',
    showTutorial: true,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        starTrackNewGameVsAI();
      } else {
        starTrackNewGameVsHuman();
      }
    },
    onTutorial: () => startStarTrackTutorial(),
  });

  if (shell.board && shell.status) {
    initStarTrackGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Hex-a-Gone
function renderHexAGone(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Hex-a-Gone!',
    helpTitle: 'How to Play Hex-a-Gone!',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the last player able to place a block on the board!</p>

          <h3>Pattern Blocks</h3>
          <p>The game uses five types of pattern blocks:</p>
          <ul>
            <li><strong>Hexagon</strong> (Yellow) - 3 available</li>
            <li><strong>Trapezoid</strong> (Red) - 6 available</li>
            <li><strong>Rhombus</strong> (Blue) - 6 available</li>
            <li><strong>Triangle</strong> (Green) - 12 available</li>
            <li><strong>Square</strong> (Orange) - 6 available</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select Blocks:</strong> Choose 1, 2, or 3 DIFFERENT blocks from the bank</li>
            <li><strong>Confirm:</strong> Click "Confirm" to lock in your selection</li>
            <li><strong>Place Blocks:</strong> Place each selected block on an empty cell</li>
          </ol>

          <h3>Example Turn</h3>
          <div class="howto-example" aria-label="Illustrated example of one Hex-a-Gone turn">
            <ol class="howto-example-steps">
              <li>
                <p class="howto-example-caption"><strong>1. Select</strong> — tap different shapes in the bank (here: triangle + rhombus)</p>
                <div class="howto-example-figure howto-example-row">
                  <span class="howto-shape howto-shape-picked" style="background-color:#32CD32" title="Triangle selected" aria-hidden="true">△</span>
                  <span class="howto-shape howto-shape-picked" style="background-color:#4169E1" title="Rhombus selected" aria-hidden="true">◇</span>
                  <span class="howto-shape" style="background-color:#FFD700" title="Hexagon not selected" aria-hidden="true">⬡</span>
                  <span class="howto-shape" style="background-color:#FF4444" title="Trapezoid not selected" aria-hidden="true">⏢</span>
                  <span class="howto-shape" style="background-color:#FF8C00" title="Square not selected" aria-hidden="true">□</span>
                </div>
                <p class="howto-example-note">Selected: <span class="howto-shape-inline" style="background-color:#32CD32">△</span> <span class="howto-shape-inline" style="background-color:#4169E1">◇</span> — then Confirm before placing</p>
              </li>
              <li>
                <p class="howto-example-caption"><strong>2. Confirm</strong> — lock the selection before placing</p>
                <div class="howto-example-figure">
                  <span class="howto-chip howto-chip-action">Confirm (2 blocks)</span>
                </div>
              </li>
              <li>
                <p class="howto-example-caption"><strong>3. Place</strong> — fit each shape on empty board cells (no overlap)</p>
                <div class="howto-example-figure">
                  <svg class="howto-hex-svg" viewBox="0 0 180 110" width="100%" height="110" role="img" aria-label="Shapes fitting onto empty hex cells">
                    <!-- empty hex grid sketch -->
                    <polygon points="40,20 55,28 55,44 40,52 25,44 25,28" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <polygon points="70,20 85,28 85,44 70,52 55,44 55,28" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <polygon points="100,20 115,28 115,44 100,52 85,44 85,28" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <polygon points="55,44 70,52 70,68 55,76 40,68 40,52" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <polygon points="85,44 100,52 100,68 85,76 70,68 70,52" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <polygon points="115,44 130,52 130,68 115,76 100,68 100,52" fill="#f5f5f5" stroke="#bbb" stroke-width="1.5"/>
                    <!-- placed triangle (covers one cell) -->
                    <polygon points="70,20 85,28 85,44 70,52 55,44 55,28" fill="#32CD32" stroke="#1b5e20" stroke-width="1.5" opacity="0.9"/>
                    <text x="70" y="40" text-anchor="middle" font-size="12" fill="#0d3d12">△</text>
                    <!-- placed rhombus (covers two cells) -->
                    <polygon points="55,44 70,52 70,68 55,76 40,68 40,52" fill="#4169E1" stroke="#1a237e" stroke-width="1.5" opacity="0.9"/>
                    <polygon points="85,44 100,52 100,68 85,76 70,68 70,52" fill="#4169E1" stroke="#1a237e" stroke-width="1.5" opacity="0.9"/>
                    <text x="70" y="64" text-anchor="middle" font-size="11" fill="#e8eaf6">◇</text>
                    <text x="148" y="30" font-size="11" fill="#333" font-family="sans-serif">1. △</text>
                    <text x="148" y="62" font-size="11" fill="#333" font-family="sans-serif">2. ◇</text>
                  </svg>
                </div>
              </li>
            </ol>
          </div>

          <h3>Rules</h3>
          <ul>
            <li>You must select all blocks BEFORE placing any</li>
            <li>Each turn, select 1-3 different block types</li>
            <li>Blocks cannot overlap or go off the board</li>
            <li>Once placed, blocks cannot be moved</li>
          </ul>

          <h3>Winning</h3>
          <p>When your opponent cannot place any blocks, you win!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Manage the block bank - don't let your opponent get the last blocks</li>
            <li>Fill strategic spaces to limit your opponent's options</li>
            <li>Sometimes placing fewer blocks is smarter</li>
          </ul>`,
    gameAreaClass: 'hex-a-gone-game-area',
    modeRadioName: 'hex-a-gone-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    showTutorial: true,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        hexAGoneNewGameVsAI();
      } else {
        hexAGoneNewGameVsHuman();
      }
    },
    onTutorial: () => startHexAGoneTutorial(),
  });

  if (shell.board && shell.status) {
    initHexAGoneGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Calla
function renderCalla(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Calla',
    helpTitle: 'How to Play Calla',
    helpContentHtml: `<h3>Objective</h3>
          <p>Collect the most cubes in your Calla (store) by the end of the game!</p>

          <h3>Setup</h3>
          <ul>
            <li>Each player has 5 shields (pits) and 1 Calla (store)</li>
            <li>Blue's Calla is on the right, Red's on the left</li>
            <li>Each shield starts with 3 cubes</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li>Click one of your shields that has cubes</li>
            <li>All cubes are picked up and "sown" one by one counter-clockwise</li>
            <li>Cubes are dropped into each pit/Calla along the way</li>
          </ol>

          <h3>Special Rules</h3>
          <ul>
            <li><strong>Free Turn:</strong> If your last cube lands in your Calla, take another turn!</li>
            <li><strong>Capture:</strong> If your last cube lands in an empty shield on your side, capture that cube AND all cubes in the opposite shield!</li>
            <li>You skip your opponent's Calla when sowing</li>
          </ul>

          <h3>Game End</h3>
          <p>The game ends when one side has no cubes. Remaining cubes go to that side's player. Most cubes in Calla wins!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Plan moves to land in your Calla for free turns</li>
            <li>Set up captures by emptying your shields</li>
            <li>Watch for opponent's capture opportunities</li>
          </ul>`,
    gameAreaClass: 'calla-game-area',
    modeRadioName: 'calla-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    showTutorial: true,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        callaNewGameVsAI();
      } else {
        callaNewGameVsHuman();
      }
    },
    onTutorial: () => startCallaTutorial(),
  });

  if (shell.board && shell.status) {
    initCallaGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render FIAR
function renderFiar(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'FIAR (Four In A Row)',
    helpTitle: 'How to Play FIAR',
    helpContentHtml: `<h3>Objective</h3>
          <p>Get four of your chips in a row along connected pathways!</p>

          <h3>Game Phases</h3>
          <ol>
            <li><strong>Placement Phase:</strong> Take turns placing 4 chips each on any empty node</li>
            <li><strong>Movement Phase:</strong> Take turns moving your chips along pathways</li>
          </ol>

          <h3>Movement Rules</h3>
          <ul>
            <li>Chips move along the connected pathways (lines)</li>
            <li>Move any distance in a straight line</li>
            <li>Cannot jump over other chips</li>
            <li>Click your chip to select, then click destination</li>
          </ul>

          <h3>Winning</h3>
          <ul>
            <li>Form 4 chips in a row along connected pathways</li>
            <li>Rows can be horizontal, vertical, or diagonal</li>
            <li><strong>Blocking:</strong> An opponent chip adjacent to your 4-in-a-row prevents the win!</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Block opponent's potential winning paths</li>
            <li>Set up multiple winning threats</li>
            <li>Control the center of the board</li>
          </ul>`,
    gameAreaClass: 'fiar-game-area',
    modeRadioName: 'fiar-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'fiar-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        fiarNewGameVsAI();
      } else {
        fiarNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initFiarGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Queens & Guards
function renderQueensGuards(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Queens & Guards',
    helpTitle: 'How to Play Queens & Guards',
    helpContentHtml: `<h3>Objective</h3>
          <p>Get your Queen to the center cell (throne) surrounded by all 6 of your Guards!</p>

          <h3>Setup</h3>
          <ul>
            <li>Each player has 1 Queen and 6 Guards</li>
            <li>Pieces start on the outer ring of the hexagonal board</li>
            <li>Blue starts on one side, Red on the opposite</li>
          </ul>

          <h3>Movement Rules</h3>
          <ul>
            <li>Click a piece to select it, then click a highlighted cell to move</li>
            <li>Pieces can only move <strong>inward</strong> (toward center) or <strong>sideways</strong> (same ring)</li>
            <li>Pieces cannot move outward (away from center)</li>
            <li>Only the Queen can occupy the center cell (throne)</li>
          </ul>

          <h3>Capturing</h3>
          <ul>
            <li>Sandwich an opponent's piece between two of yours to capture it</li>
            <li>Captured pieces must be relocated to the outer ring</li>
            <li>You cannot move into a position where you would be sandwiched</li>
          </ul>

          <h3>Winning</h3>
          <p>Place your Queen on the center throne and surround it with all 6 of your Guards in the inner ring!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Protect your Queen while advancing toward the center</li>
            <li>Set up captures to slow your opponent</li>
            <li>Position guards strategically for the final winning formation</li>
          </ul>`,
    gameAreaClass: 'qg-game-area',
    modeRadioName: 'qg-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'qg-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        qgNewGameVsAI();
      } else {
        qgNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initQGGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Contig 60
function renderContig60(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Contig 60',
    helpTitle: 'How to Play Contig 60',
    helpContentHtml: `<h3>Objective</h3>
          <p>Score the most points by placing chips on the board adjacent to other chips!</p>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Roll:</strong> Roll three dice</li>
            <li><strong>Calculate:</strong> Use all three numbers with +, -, ×, ÷ to make a result</li>
            <li><strong>Place:</strong> Put your chip on that number on the board</li>
          </ol>

          <h3>Scoring</h3>
          <ul>
            <li>Score <strong>1 point</strong> for each adjacent chip already on the board</li>
            <li>Adjacent means touching horizontally, vertically, or diagonally</li>
            <li>Maximum 8 points per placement (surrounded on all sides)</li>
          </ul>

          <h3>Expression Rules</h3>
          <ul>
            <li>You must use <strong>all three dice</strong></li>
            <li>You can use <strong>any two operations</strong> (can repeat)</li>
            <li>Operations: + (add), - (subtract), × (multiply), ÷ (divide)</li>
            <li>Division must result in a whole number</li>
          </ul>

          <h3>Passing</h3>
          <ul>
            <li>If you cannot make any available number, you must pass</li>
            <li>Three consecutive passes eliminates you from the game</li>
          </ul>

          <h3>Winning</h3>
          <ul>
            <li><strong>5 in a row:</strong> First to get 5 chips in a line wins!</li>
            <li><strong>By points:</strong> When board is full, highest score wins</li>
          </ul>`,
    gameAreaClass: 'contig-game-area',
    modeRadioName: 'contig-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'contig-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        contigNewGameVsAI();
      } else {
        contigNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initContigGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Juggle
function renderJuggle(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Juggle',
    helpTitle: 'How to Play Juggle',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the first player to completely fill your 9x9 grid with polyomino shapes!</p>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Roll:</strong> Roll two dice</li>
            <li><strong>Choose:</strong> Pick one die - its value determines your shape category</li>
            <li><strong>Select:</strong> Choose a specific shape from that category</li>
            <li><strong>Place:</strong> Position and place the shape on your board</li>
          </ol>

          <h3>Dice Values</h3>
          <ul>
            <li><strong>1</strong> = Monomino (1 cell)</li>
            <li><strong>2</strong> = Domino (2 cells)</li>
            <li><strong>3</strong> = Tromino (3 cells)</li>
            <li><strong>4</strong> = Tetromino (4 cells)</li>
            <li><strong>5-6</strong> = Pentomino (5 cells)</li>
          </ul>

          <h3>Placement Rules</h3>
          <ul>
            <li>Shapes can be rotated and flipped</li>
            <li>Shapes must fit entirely within your 9x9 grid</li>
            <li>Shapes cannot overlap with previously placed shapes</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Larger shapes fill the board faster</li>
            <li>Save small shapes for filling gaps</li>
            <li>Plan ahead to avoid getting stuck</li>
          </ul>`,
    gameAreaClass: 'juggle-game-area',
    modeRadioName: 'juggle-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'juggle-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        juggleNewGameVsAI();
      } else {
        juggleNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initJuggleGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Fab-a-Diffy
function renderFabADiffy(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Fab-a-Diffy',
    helpTitle: 'How to Play Fab-a-Diffy',
    helpContentHtml: `<h3>Objective</h3>
          <p>Claim the most answer bars by combining fraction bars with operations!</p>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select Bars:</strong> Choose two fraction bars from your pool</li>
            <li><strong>Choose Operation:</strong> Pick +, −, ×, or ÷</li>
            <li><strong>Match Answer:</strong> If the result matches an available answer bar, claim it!</li>
          </ol>

          <h3>Operations</h3>
          <ul>
            <li><strong>+</strong> Add fractions</li>
            <li><strong>−</strong> Subtract fractions</li>
            <li><strong>×</strong> Multiply fractions</li>
            <li><strong>÷</strong> Divide fractions</li>
          </ul>

          <h3>Rules</h3>
          <ul>
            <li>Each fraction bar can only be used once</li>
            <li>Results are automatically simplified</li>
            <li>Equivalent fractions match (e.g., 2/4 = 1/2)</li>
          </ul>

          <h3>Winning</h3>
          <p>The player who claims the most answer bars when all bars are used wins!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Plan combinations that match multiple possible answers</li>
            <li>Block opponent's potential matches</li>
            <li>Save versatile fractions for later</li>
          </ul>`,
    gameAreaClass: 'fab-game-area',
    modeRadioName: 'fab-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'fab-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        fabNewGameVsAI(shell.board!);
      } else {
        fabNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initFabGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Sum Dominoes
function renderSumDominoes(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Sum Dominoes & Dice',
    helpTitle: 'How to Play Sum Dominoes & Dice',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the first player to get rid of all your dominoes!</p>

          <h3>Setup</h3>
          <ul>
            <li>Each player receives 7 dominoes</li>
            <li>A starting domino is placed in the center of the board</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Roll Dice:</strong> Roll two dice to get a target sum (2-12)</li>
            <li><strong>Select Domino:</strong> Choose a domino from your hand</li>
            <li><strong>Match & Place:</strong> Place it so one of its faces + an adjacent face on the board = your dice sum</li>
          </ol>

          <h3>Matching Rules</h3>
          <ul>
            <li>Your domino must connect to an existing domino on the board</li>
            <li>The face touching must create the rolled sum</li>
            <li>Example: You rolled 8. Place [3|5] next to a [5|2] so 3+5=8</li>
          </ul>

          <h3>Passing</h3>
          <ul>
            <li>If you cannot play any domino, you must pass</li>
            <li>If both players pass consecutively, the game ends</li>
            <li>Player with fewer total pips on remaining dominoes wins</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Try to play high-pip dominoes first</li>
            <li>Watch which sums are likely based on dice probabilities</li>
            <li>7 is the most common dice sum</li>
          </ul>`,
    gameAreaClass: 'sd-game-area',
    modeRadioName: 'sd-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'sd-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        sdNewGameVsAI(shell.board!);
      } else {
        sdNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initSDGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Par 55
function renderPar55(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Par 55',
    helpTitle: 'How to Play Par 55',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the first player to score 55 points by matching attributes on the board!</p>

          <h3>Attribute Blocks</h3>
          <p>Each block has 4 attributes:</p>
          <ul>
            <li><strong>Shape:</strong> Circle, Square, Triangle, Rectangle, or Hexagon</li>
            <li><strong>Color:</strong> Red, Blue, or Yellow</li>
            <li><strong>Size:</strong> Small or Large</li>
            <li><strong>Thickness:</strong> Thin or Thick</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select Block:</strong> Choose a block from your hand (5 blocks)</li>
            <li><strong>Place Block:</strong> Put it on an empty base adjacent to occupied bases</li>
            <li><strong>Score Points:</strong> Earn 1 point for each matching attribute with adjacent blocks</li>
          </ol>

          <h3>Scoring</h3>
          <ul>
            <li>Compare your placed block to each adjacent block</li>
            <li>Score 1 point per matching attribute (max 4 per connection)</li>
            <li>Multiple adjacent blocks = multiple scoring opportunities!</li>
          </ul>

          <h3>Winning</h3>
          <p>First player to reach 55 points wins! In case of a tie, the player who reaches 55 first wins.</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Place blocks near multiple occupied bases for more points</li>
            <li>Match as many attributes as possible</li>
            <li>Watch what blocks your opponent has played</li>
          </ul>`,
    gameAreaClass: 'par55-game-area',
    modeRadioName: 'par55-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'par55-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        par55NewGameVsAI(shell.board!);
      } else {
        par55NewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initPar55Game(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Ramrod
function renderRamrod(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Ramrod',
    helpTitle: 'How to Play Ramrod',
    helpContentHtml: `<h3>Objective</h3>
          <p>Be the first player to capture 24 cm worth of sum boxes!</p>

          <h3>Cuisenaire Rods</h3>
          <p>Each rod has a color and length (1-10 cm):</p>
          <ul>
            <li><strong>White</strong> = 1cm, <strong>Red</strong> = 2cm</li>
            <li><strong>Light Green</strong> = 3cm, <strong>Purple</strong> = 4cm</li>
            <li><strong>Yellow</strong> = 5cm, <strong>Dark Green</strong> = 6cm</li>
            <li><strong>Black</strong> = 7cm, <strong>Brown</strong> = 8cm</li>
            <li><strong>Blue</strong> = 9cm, <strong>Orange</strong> = 10cm</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select Rod:</strong> Choose a rod from your collection</li>
            <li><strong>Place Rod:</strong> Put it in an empty slot on a sum box</li>
            <li><strong>Capture:</strong> When two rods in a box equal the target sum, you capture it!</li>
          </ol>

          <h3>Capturing Rules</h3>
          <ul>
            <li>Each sum box has a target value (5-10)</li>
            <li>Place two rods that add up to the target sum</li>
            <li>You capture the box and score its cm value</li>
          </ul>

          <h3>Winning</h3>
          <p>First player to capture 24 cm worth of boxes wins!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Set up captures for yourself</li>
            <li>Block opponent's potential captures</li>
            <li>Higher value boxes are worth more!</li>
          </ul>`,
    gameAreaClass: 'ramrod-game-area',
    modeRadioName: 'ramrod-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'ramrod-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        ramrodNewGameVsAI(shell.board!);
      } else {
        ramrodNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initRamrodGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Kwatro-Sinko
function renderKwatrasinko(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Kwatro-Sinko',
    helpTitle: 'How to Play Kwatro-Sinko',
    helpContentHtml: `<h3>Objective</h3>
          <p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>

          <h3>Setup</h3>
          <ul>
            <li><strong>Blue (Player 1):</strong> Even chips (0, 2, 4, 6, 8)</li>
            <li><strong>Red (Player 2):</strong> Odd chips (1, 3, 5, 7, 9)</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select Chip:</strong> Click one of your chips on the board</li>
            <li><strong>Move:</strong> Click a connected green space to move there</li>
          </ol>

          <h3>Movement Rules</h3>
          <ul>
            <li>Chips move along the pathway connections</li>
            <li>You can only move to empty adjacent spaces</li>
            <li>Diagonal connections exist on numbered spaces</li>
          </ul>

          <h3>Winning</h3>
          <ul>
            <li>Form 3 chips in a line (any direction)</li>
            <li>The alignment must satisfy: <strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong></li>
            <li>Example: 6 + 3 - 5 = 4 ✓</li>
            <li>Example: 8 + 1 - 4 = 5 ✓</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Control the center to maximize movement options</li>
            <li>Watch for potential winning combinations</li>
            <li>Block your opponent's alignments</li>
          </ul>`,
    gameAreaClass: 'kwa-game-area',
    modeRadioName: 'kwa-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'kwa-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        kwaNewGameVsAI(shell.board!);
      } else {
        kwaNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initKwaGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Prime Gold
function renderPrimeGold(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Prime Gold',
    helpTitle: 'How to Play Prime Gold',
    helpContentHtml: `<h3>Objective</h3>
          <p>Form 4 diagonal veins of prime numbers to win!</p>

          <h3>The Board</h3>
          <ul>
            <li>7x7 grid with numbers spiraling from center</li>
            <li>Gold cells are prime numbers</li>
            <li>Primes naturally occur along diagonals</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Roll Dice:</strong> Roll 3 dice (d6, d8, d10)</li>
            <li><strong>Create Expression:</strong> Combine dice using +, -, *, /, ^, !</li>
            <li><strong>Place Chip:</strong> Put chip on the matching number</li>
          </ol>

          <h3>Operations</h3>
          <ul>
            <li><strong>Basic:</strong> +, -, ×, ÷</li>
            <li><strong>Exponents:</strong> a^b (e.g., 2^3 = 8)</li>
            <li><strong>Factorials:</strong> n! (e.g., 4! = 24)</li>
          </ul>

          <h3>Prime Veins</h3>
          <ul>
            <li>A vein = 4+ chips in a diagonal line</li>
            <li>Chips must be on prime numbers</li>
            <li>First to 4 veins wins!</li>
          </ul>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Target prime numbers (gold cells)</li>
            <li>Build along diagonal lines</li>
            <li>Block opponent's potential veins</li>
            <li>Factorials give big numbers: 5!=120</li>
          </ul>`,
    gameAreaClass: 'pg-game-area',
    modeRadioName: 'pg-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'pg-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        primeGoldNewGameVsAI(shell.board!);
      } else {
        primeGoldNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initPrimeGoldGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

// Render Pent'Em In
function renderPentEmIn(): void {
  const shell = mountGameShell(appContainer!, {
    title: "Pent'Em In",
    helpTitle: "How to Play Pent'Em In",
    helpContentHtml: `<h3>Objective</h3>
          <p>Trap your opponent so they can't place any more pieces!</p>

          <h3>Setup</h3>
          <ul>
            <li>10x10 grid board</li>
            <li>Each player has 12 pentomino pieces (5-cell shapes)</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li><strong>Select:</strong> Choose a piece from your bank</li>
            <li><strong>Rotate/Flip:</strong> Adjust orientation if needed</li>
            <li><strong>Place:</strong> Put piece on empty board cells</li>
          </ol>

          <h3>Rules</h3>
          <ul>
            <li>Pieces cannot overlap</li>
            <li>All 5 cells must fit on the board</li>
            <li>Pieces stay where placed</li>
          </ul>

          <h3>Winning</h3>
          <p>When your opponent cannot place any of their remaining pieces, you win!</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Control the center early</li>
            <li>Leave awkward spaces for your opponent</li>
            <li>Save flexible pieces for later</li>
          </ul>`,
    gameAreaClass: 'pent-game-container',
    modeRadioName: 'pent-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        pentNewGameVsAI();
      } else {
        pentNewGameVsHuman();
      }
    },
  });

  if (shell.board && shell.status) {
    initPentEmInGame(shell.board, shell.status);
  }

  currentCleanup = shell.cleanup;
}

// Render Frac Fact
function renderFracFact(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Frac Fact',
    helpTitle: 'How to Play Frac Fact',
    helpContentHtml: `<h3>Objective</h3>
          <p>Score more points than your opponent by correctly solving fraction problems!</p>

          <h3>Gameplay</h3>
          <ul>
            <li>Players take turns solving fraction arithmetic problems</li>
            <li>Choose the correct answer from 4 options</li>
            <li>Earn points for correct answers</li>
            <li>Build streaks for bonus points!</li>
          </ul>

          <h3>Scoring</h3>
          <ul>
            <li><strong>Correct answer:</strong> 10 points</li>
            <li><strong>Streak bonus:</strong> +5 points per consecutive correct answer</li>
          </ul>

          <h3>Difficulty Levels</h3>
          <ul>
            <li><strong>Easy:</strong> Addition and subtraction with simple fractions</li>
            <li><strong>Medium:</strong> Includes multiplication</li>
            <li><strong>Hard:</strong> All operations including division</li>
          </ul>

          <h3>Winning</h3>
          <p>After 10 problems each, the player with the highest score wins!</p>`,
    modeRadioName: 'frac-mode',
    vsHumanDescription: 'Take turns solving problems',
    vsAiDescription: 'Compete against the computer',
    showStatus: false,
    mountId: 'game-container',
    gameAreaHtml: `<div id="game-container" class="frac-game-container"></div>`,
    newGameExtraHtml: `
          <div class="difficulty-selector">
            <h4>Difficulty</h4>
            <div class="difficulty-options">
              <label class="difficulty-option">
                <input type="radio" name="frac-difficulty" value="easy">
                <span>Easy</span>
              </label>
              <label class="difficulty-option">
                <input type="radio" name="frac-difficulty" value="medium" checked>
                <span>Medium</span>
              </label>
              <label class="difficulty-option">
                <input type="radio" name="frac-difficulty" value="hard">
                <span>Hard</span>
              </label>
            </div>
          </div>`,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      const selectedDifficulty = document.querySelector(
        'input[name="frac-difficulty"]:checked'
      ) as HTMLInputElement | null;
      const difficulty = (selectedDifficulty?.value ||
        'medium') as AIDifficultyLevel;
      if (mode === 'human-vs-ai') {
        fracNewGameVsAI(difficulty);
      } else {
        fracNewGameVsHuman(difficulty);
      }
    },
  });

  if (shell.board) {
    initFracFactGame(shell.board);
  }

  currentCleanup = shell.cleanup;
}

// Render Remainder Islands
function renderRemainderIslands(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Remainder Islands',
    helpTitle: 'How to Play Remainder Islands',
    helpContentHtml: `<h3>Objective</h3>
          <p>Score the most points by strategically placing chips on islands using division remainders!</p>

          <h3>Gameplay</h3>
          <ol>
            <li><strong>Roll:</strong> Roll two dice to get your total</li>
            <li><strong>Divide:</strong> Choose an island and divide your total by its value</li>
            <li><strong>Score:</strong> Earn points equal to the remainder</li>
          </ol>

          <h3>Example</h3>
          <p>Roll 7, choose island with value 3: 7 ÷ 3 = 2 R1 → Score 1 point</p>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Choose islands that give the highest remainder</li>
            <li>Claim islands to block your opponent</li>
            <li>Remember: higher divisors can give higher remainders!</li>
          </ul>

          <h3>Winning</h3>
          <p>After all turns, the player with the most points wins!</p>`,
    modeRadioName: 'remainder-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    showStatus: false,
    mountId: 'game-container',
    gameAreaHtml: `<div id="game-container" class="remainder-game-container"></div>`,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        remainderNewGameVsAI();
      } else {
        remainderNewGameVsHuman();
      }
    },
  });

  if (shell.board) {
    initRemainderGame(shell.board);
  }

  currentCleanup = shell.cleanup;
}

// Render Fraction Pinball
function renderFractionPinball(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Fraction Pinball',
    helpTitle: 'How to Play Fraction Pinball',
    helpContentHtml: `<h3>Objective</h3>
          <p>Score points by correctly converting between fractions and decimals!</p>

          <h3>Gameplay</h3>
          <ul>
            <li>Each turn, convert a fraction to decimal or decimal to fraction</li>
            <li>Correct answers hit pinball targets for points</li>
            <li>Wrong answers lose a ball</li>
          </ul>

          <h3>Scoring</h3>
          <p>Different targets award different points: 10, 20, 30, 50, or 100!</p>

          <h3>Common Conversions</h3>
          <ul>
            <li>1/2 = 0.5</li>
            <li>1/4 = 0.25, 3/4 = 0.75</li>
            <li>1/5 = 0.2, 2/5 = 0.4</li>
            <li>1/8 = 0.125</li>
          </ul>

          <h3>Winning</h3>
          <p>Player with the most points after all rounds wins!</p>`,
    modeRadioName: 'pinball-mode',
    vsHumanDescription: 'Take turns converting',
    vsAiDescription: 'Challenge the computer',
    showStatus: false,
    mountId: 'game-container',
    gameAreaHtml: `<div id="game-container" class="pinball-game-container"></div>`,
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        pinballNewGameVsAI();
      } else {
        pinballNewGameVsHuman();
      }
    },
  });

  if (shell.board) {
    initPinballGame(shell.board);
  }

  currentCleanup = shell.cleanup;
}

// Render Stars & Bars
function renderStarsBars(): void {
  const shell = mountGameShell(appContainer!, {
    title: 'Stars & Bars',
    helpTitle: 'How to Play Stars & Bars',
    helpContentHtml: `<h3>Objective</h3>
          <p>Score 30 points by placing attribute cards with maximum differences from adjacent cards!</p>

          <h3>Attribute Cards</h3>
          <p>Each card has 4 attributes:</p>
          <ul>
            <li><strong>Shape:</strong> Circle, Square, Triangle, Hexagon, Rectangle</li>
            <li><strong>Color:</strong> Red, Blue, Yellow</li>
            <li><strong>Size:</strong> Small, Large</li>
            <li><strong>Thickness:</strong> Thin, Thick</li>
          </ul>

          <h3>Scoring</h3>
          <ul>
            <li>Compare your card to ALL adjacent cards (8 directions)</li>
            <li>Score 1 point for each attribute that differs</li>
            <li>Maximum 4 points per adjacent card (all different)</li>
            <li>Star cells double your points!</li>
          </ul>

          <h3>Examples</h3>
          <ul>
            <li>Same shape, same color, different size, different thickness = 2 points</li>
            <li>All 4 attributes different = 4 points</li>
          </ul>

          <h3>Turn Sequence</h3>
          <ol>
            <li>Select a card from your hand</li>
            <li>Place it on a green (valid) cell</li>
            <li>Must place adjacent to existing cards</li>
          </ol>

          <h3>Strategy Tips</h3>
          <ul>
            <li>Maximize differences from adjacent cards</li>
            <li>Star cells (corners + center) double points</li>
            <li>Position cards for multiple adjacencies</li>
          </ul>`,
    gameAreaClass: 'stars-game-area',
    modeRadioName: 'stars-mode',
    vsHumanDescription: 'Pass & play with a friend',
    vsAiDescription: 'Challenge the computer',
    boardClass: 'stars-board-container',
    onNavigateHome: () => navigate('/'),
    onStartGame: (mode) => {
      if (mode === 'human-vs-ai') {
        starsNewGameVsAI(shell.board!);
      } else {
        starsNewGameVsHuman(shell.board!);
      }
    },
  });

  if (shell.board) {
    initStarsGame(shell.board, false);
  }

  currentCleanup = shell.cleanup;
}

function renderDiceDemoPage(): void {
  cleanup();
  document.title = 'Dice System Demo';
  renderDiceDemo(appContainer!);
}

// Render alignment demo
function renderAlignmentDemoPage(): void {
  cleanup();
  document.title = 'Alignment Detection Demo';
  renderAlignmentDemo(appContainer!);
}

// Render fraction demo
function renderFractionDemoPage(): void {
  cleanup();
  document.title = 'Fraction System Demo';
  renderFractionDemo(appContainer!);
}

// Render polyomino demo
function renderPolyominoDemoPage(): void {
  cleanup();
  document.title = 'Polyomino System Demo';
  renderPolyominoDemo(appContainer!);
}

// Render graph demo
function renderGraphDemoPage(): void {
  cleanup();
  document.title = 'Graph/Network System Demo';
  renderGraphDemo(appContainer!);
}

// Render attribute demo
function renderAttributeDemoPage(): void {
  cleanup();
  document.title = 'Attribute Logic Demo';
  renderAttributeDemo(appContainer!);
}

// Render expression demo
function renderExpressionDemoPage(): void {
  cleanup();
  document.title = 'Expression Builder Demo';
  renderExpressionDemo(appContainer!);
}

// Set up routes
addRoute('/', renderHome);
addRoute('/game/:id', renderGame);
addRoute('/demo/dice', renderDiceDemoPage);
addRoute('/demo/alignment', renderAlignmentDemoPage);
addRoute('/demo/fractions', renderFractionDemoPage);
addRoute('/demo/polyomino', renderPolyominoDemoPage);
addRoute('/demo/graph', renderGraphDemoPage);
addRoute('/demo/attributes', renderAttributeDemoPage);
addRoute('/demo/expressions', renderExpressionDemoPage);

// Initialize router
initRouter();

// Initialize Ollie the Owl mascot system
owlComponent.init();
owlSystem.initialize();
