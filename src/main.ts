import './style.css';
import { addRoute, initRouter, getCurrentPath, getPathParams, navigate } from './core/router';
import { owlSystem } from './core/owl';
import { owlComponent } from './ui/owl';
import { renderGameSelector } from './ui/game-selector';
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
} from './games/star-track/game-controller';
import {
  initGame as initHexAGoneGame,
  newGameVsHuman as hexAGoneNewGameVsHuman,
  newGameVsAI as hexAGoneNewGameVsAI,
} from './games/hex-a-gone/game-controller';
import {
  initGame as initCallaGame,
  newGameVsHuman as callaNewGameVsHuman,
  newGameVsAI as callaNewGameVsAI,
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

// Render Kings & Quadraphages game
function renderKingsQuadraphages(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Kings & Quadraphages</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="tutorial-btn">Tutorial</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="game-area">
      <div id="move-history" class="move-history collapsible">
        <button class="collapse-toggle" aria-expanded="true" aria-controls="history-content">
          <span class="collapse-icon">◀</span>
          <span class="collapse-label">History</span>
        </button>
        <div id="history-content" class="history-content"></div>
      </div>
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option selected" data-mode="human-vs-ai">
              <input type="radio" name="game-mode" value="human-vs-ai" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer opponent</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="game-mode" value="human-vs-human">
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
          </div>
          <div id="difficulty-section" class="difficulty-selector">
            <h4>AI Difficulty</h4>
            <div class="difficulty-options">
              <button class="difficulty-btn easy" data-difficulty="easy">Easy</button>
              <button class="difficulty-btn medium selected" data-difficulty="medium">Medium</button>
              <button class="difficulty-btn hard" data-difficulty="hard">Hard</button>
            </div>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Kings & Quadraphages</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          <p>You win when your opponent's King has no valid moves at the start of their turn!</p>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const historyContentContainer = document.getElementById('history-content');
  const moveHistoryPanel = document.getElementById('move-history');
  const collapseToggle = moveHistoryPanel?.querySelector('.collapse-toggle');
  const newGameBtn = document.getElementById('new-game-btn');
  const tutorialBtn = document.getElementById('tutorial-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initKQGame(
      boardContainer,
      statusContainer,
      historyContentContainer || undefined,
      newGameBtn || undefined
    );
  }

  // Wire up collapse toggle for move history
  if (collapseToggle && moveHistoryPanel) {
    collapseToggle.addEventListener('click', () => {
      const isCollapsed = moveHistoryPanel.classList.toggle('collapsed');
      collapseToggle.setAttribute('aria-expanded', String(!isCollapsed));
    });
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const difficultySection = document.getElementById('difficulty-section');
    const difficultyBtns = newGameModal.querySelectorAll('.difficulty-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-ai';
    let selectedDifficulty: AIDifficulty = 'medium';

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';

        // Show/hide difficulty section
        if (difficultySection) {
          difficultySection.style.display =
            selectedMode === 'human-vs-ai' ? 'block' : 'none';
        }
      });
    });

    // Difficulty selection
    difficultyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        difficultyBtns.forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDifficulty = (btn as HTMLElement).dataset.difficulty as AIDifficulty;
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        kqNewGameVsAI(selectedDifficulty, true);
      } else {
        kqNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Tutorial button
  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', () => {
      startTutorial();
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Hex game
function renderHex(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Hex</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="hex-game-area">
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="hex-game-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="hex-game-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer (basic)</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Hex</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initHexGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        hexNewGameVsAI();
      } else {
        hexNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Star Track game
function renderStarTrack(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Star Track</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="star-track-game-area">
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="star-track-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="star-track-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Race against the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Star Track</h2>
        <div class="rules-content">
          <h3>Objective</h3>
          <p>Be the first player to reach the center star!</p>

          <h3>Players</h3>
          <ul>
            <li><strong>Blue</strong> starts from the top</li>
            <li><strong>Red</strong> starts from the bottom</li>
          </ul>

          <h3>Gameplay</h3>
          <ol>
            <li><strong>Draw Chains:</strong> Click to draw two chain links from the bucket</li>
            <li><strong>Choose:</strong> Select which chain to use for movement</li>
            <li><strong>Move:</strong> Your piece advances by the chain's length</li>
          </ol>

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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initStarTrackGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        starTrackNewGameVsAI();
      } else {
        starTrackNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Hex-a-Gone! game
function renderHexAGone(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Hex-a-Gone!</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="hex-a-gone-game-area">
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="hex-a-gone-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="hex-a-gone-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Hex-a-Gone!</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initHexAGoneGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        hexAGoneNewGameVsAI();
      } else {
        hexAGoneNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Calla game
function renderCalla(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Calla</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="calla-game-area">
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="calla-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="calla-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Calla</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initCallaGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        callaNewGameVsAI();
      } else {
        callaNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render FIAR game
function renderFiar(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>FIAR (Four In A Row)</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="fiar-game-area">
      <div id="board" class="fiar-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="fiar-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="fiar-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play FIAR</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initFiarGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        fiarNewGameVsAI();
      } else {
        fiarNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Queens & Guards game
function renderQueensGuards(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Queens & Guards</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="qg-game-area">
      <div id="board" class="qg-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="qg-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="qg-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Queens & Guards</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initQGGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        qgNewGameVsAI();
      } else {
        qgNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Contig 60 game
function renderContig60(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Contig 60</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="contig-game-area">
      <div id="board" class="contig-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="contig-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="contig-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Contig 60</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initContigGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        contigNewGameVsAI();
      } else {
        contigNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Juggle game
function renderJuggle(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Juggle</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="juggle-game-area">
      <div id="board" class="juggle-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="juggle-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="juggle-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Juggle</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initJuggleGame(boardContainer, statusContainer);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        juggleNewGameVsAI();
      } else {
        juggleNewGameVsHuman();
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Fab-a-Diffy game
function renderFabADiffy(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Fab-a-Diffy</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="fab-game-area">
      <div id="board" class="fab-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="fab-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="fab-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Fab-a-Diffy</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initFabGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        fabNewGameVsAI(boardContainer!);
      } else {
        fabNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Sum Dominoes & Dice game
function renderSumDominoes(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Sum Dominoes & Dice</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="sd-game-area">
      <div id="board" class="sd-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="sd-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="sd-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Sum Dominoes & Dice</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initSDGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        sdNewGameVsAI(boardContainer!);
      } else {
        sdNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Par 55 game
function renderPar55(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Par 55</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="par55-game-area">
      <div id="board" class="par55-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="par55-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="par55-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Par 55</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initPar55Game(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        par55NewGameVsAI(boardContainer!);
      } else {
        par55NewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Ramrod game
function renderRamrod(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Ramrod</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="ramrod-game-area">
      <div id="board" class="ramrod-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="ramrod-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="ramrod-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Ramrod</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initRamrodGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        ramrodNewGameVsAI(boardContainer!);
      } else {
        ramrodNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Kwatro-Sinko game
function renderKwatrasinko(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Games</button>
      <h1>Kwatro-Sinko</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="kwa-game-area">
      <div id="board" class="kwa-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="kwa-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="kwa-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Kwatro-Sinko</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initKwaGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        kwaNewGameVsAI(boardContainer!);
      } else {
        kwaNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Prime Gold game
function renderPrimeGold(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Prime Gold</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="pg-game-area">
      <div id="board" class="pg-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="pg-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="pg-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Prime Gold</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initPrimeGoldGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        primeGoldNewGameVsAI(boardContainer!);
      } else {
        primeGoldNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render Pent'Em In game
function renderPentEmIn(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Pent'Em In</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="pent-game-container">
      <div id="board"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="pent-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="pent-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Pent'Em In</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  const boardContainer = document.getElementById('board');
  const statusContainer = document.getElementById('status');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer && statusContainer) {
    initPentEmInGame(boardContainer, statusContainer);
  }

  // Wire up New Game button
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up Start Game button
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn && newGameModal) {
    startGameBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="pent-mode"]:checked') as HTMLInputElement;
      if (selectedMode?.value === 'human-vs-ai') {
        pentNewGameVsAI();
      } else {
        pentNewGameVsHuman();
      }
      newGameModal.classList.add('hidden');
    });
  }

  // Wire up Help button
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.add('show');
    });
  }

  // Modal close handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    });
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Escape key to close modals
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Render Frac Fact game
function renderFracFact(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Frac Fact</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="game-container" class="frac-game-container"></div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="frac-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Take turns solving problems</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="frac-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Compete against the computer</div>
              </div>
            </label>
          </div>
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
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Frac Fact</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          <p>After 10 problems each, the player with the highest score wins!</p>
        </div>
      </div>
    </div>
  `;

  const gameContainer = document.getElementById('game-container');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (gameContainer) {
    initFracFactGame(gameContainer);
  }

  // Wire up New Game button
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up Start Game button
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn && newGameModal) {
    startGameBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="frac-mode"]:checked') as HTMLInputElement;
      const selectedDifficulty = document.querySelector('input[name="frac-difficulty"]:checked') as HTMLInputElement;
      const difficulty = (selectedDifficulty?.value || 'medium') as 'easy' | 'medium' | 'hard';

      if (selectedMode?.value === 'human-vs-ai') {
        fracNewGameVsAI(difficulty);
      } else {
        fracNewGameVsHuman(difficulty);
      }
      newGameModal.classList.add('hidden');
    });
  }

  // Wire up Help button
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.add('show');
    });
  }

  // Modal close handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    });
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Mode option selection
  document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]') as HTMLInputElement;
      if (radio) radio.checked = true;
    });
  });

  // Escape key to close modals
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Render Remainder Islands game
function renderRemainderIslands(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Remainder Islands</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="game-container" class="remainder-game-container"></div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="remainder-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="remainder-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Remainder Islands</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          <p>After all turns, the player with the most points wins!</p>
        </div>
      </div>
    </div>
  `;

  const gameContainer = document.getElementById('game-container');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (gameContainer) {
    initRemainderGame(gameContainer);
  }

  // Wire up New Game button
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up Start Game button
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn && newGameModal) {
    startGameBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="remainder-mode"]:checked') as HTMLInputElement;

      if (selectedMode?.value === 'human-vs-ai') {
        remainderNewGameVsAI();
      } else {
        remainderNewGameVsHuman();
      }
      newGameModal.classList.add('hidden');
    });
  }

  // Wire up Help button
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.add('show');
    });
  }

  // Modal close handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    });
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Mode option selection
  document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]') as HTMLInputElement;
      if (radio) radio.checked = true;
    });
  });

  // Escape key to close modals
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Render Fraction Pinball game
function renderFractionPinball(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Fraction Pinball</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="game-container" class="pinball-game-container"></div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="pinball-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Take turns converting</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="pinball-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Fraction Pinball</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          <p>Player with the most points after all rounds wins!</p>
        </div>
      </div>
    </div>
  `;

  const gameContainer = document.getElementById('game-container');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (gameContainer) {
    initPinballGame(gameContainer);
  }

  // Wire up New Game button
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up Start Game button
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn && newGameModal) {
    startGameBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="pinball-mode"]:checked') as HTMLInputElement;

      if (selectedMode?.value === 'human-vs-ai') {
        pinballNewGameVsAI();
      } else {
        pinballNewGameVsHuman();
      }
      newGameModal.classList.add('hidden');
    });
  }

  // Wire up Help button
  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', () => {
      helpModal.classList.add('show');
    });
  }

  // Modal close handlers
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    });
  });

  // Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Mode option selection
  document.querySelectorAll('.mode-option').forEach(option => {
    option.addEventListener('click', () => {
      document.querySelectorAll('.mode-option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]') as HTMLInputElement;
      if (radio) radio.checked = true;
    });
  });

  // Escape key to close modals
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      });
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// Render Stars & Bars game
function renderStarsBars(): void {
  appContainer!.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">Games</button>
      <h1>Stars & Bars</h1>
    </header>
    <div class="button-row">
      <button id="new-game-btn">New Game</button>
      <button id="help-btn">How to Play</button>
    </div>
    <div id="status"></div>
    <div class="stars-game-area">
      <div id="board" class="stars-board-container"></div>
    </div>
    <div id="new-game-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>New Game</h2>
        <div class="mode-selector">
          <h3>Choose Game Mode</h3>
          <div class="mode-options">
            <label class="mode-option" data-mode="human-vs-human">
              <input type="radio" name="stars-mode" value="human-vs-human" checked>
              <div class="mode-option-content">
                <div class="mode-option-title">2 Player</div>
                <div class="mode-option-desc">Pass & play with a friend</div>
              </div>
            </label>
            <label class="mode-option" data-mode="human-vs-ai">
              <input type="radio" name="stars-mode" value="human-vs-ai">
              <div class="mode-option-content">
                <div class="mode-option-title">Play vs AI</div>
                <div class="mode-option-desc">Challenge the computer</div>
              </div>
            </label>
          </div>
          <button id="start-game-btn" class="start-game-btn">Start Game</button>
        </div>
      </div>
    </div>
    <div id="help-modal" class="modal hidden">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2>How to Play Stars & Bars</h2>
        <div class="rules-content">
          <h3>Objective</h3>
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
          </ul>
        </div>
      </div>
    </div>
  `;

  // Initialize game
  const boardContainer = document.getElementById('board');
  const newGameBtn = document.getElementById('new-game-btn');
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const newGameModal = document.getElementById('new-game-modal');
  const backBtn = document.getElementById('back-btn');

  if (boardContainer) {
    initStarsGame(boardContainer, false);
  }

  // Wire up New Game button to show modal
  if (newGameBtn && newGameModal) {
    newGameBtn.addEventListener('click', () => {
      newGameModal.classList.remove('hidden');
    });
  }

  // Wire up New Game Modal
  if (newGameModal) {
    const modalClose = newGameModal.querySelector('.modal-close');
    const modeOptions = newGameModal.querySelectorAll('.mode-option');
    const startGameBtn = document.getElementById('start-game-btn');

    let selectedMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human';

    // Set initial selected state
    modeOptions.forEach((option) => {
      const input = option.querySelector('input') as HTMLInputElement;
      if (input.checked) {
        option.classList.add('selected');
      }
    });

    const closeNewGameModal = () => {
      newGameModal.classList.add('hidden');
    };

    // Mode selection
    modeOptions.forEach((option) => {
      option.addEventListener('click', () => {
        modeOptions.forEach((o) => o.classList.remove('selected'));
        option.classList.add('selected');
        const input = option.querySelector('input') as HTMLInputElement;
        input.checked = true;
        selectedMode = input.value as 'human-vs-human' | 'human-vs-ai';
      });
    });

    // Start game button
    startGameBtn?.addEventListener('click', () => {
      closeNewGameModal();
      if (selectedMode === 'human-vs-ai') {
        starsNewGameVsAI(boardContainer!);
      } else {
        starsNewGameVsHuman(boardContainer!);
      }
    });

    // Close modal
    modalClose?.addEventListener('click', closeNewGameModal);

    // Close on backdrop click
    newGameModal.addEventListener('click', (e) => {
      if (e.target === newGameModal) {
        closeNewGameModal();
      }
    });
  }

  // Wire up Back button
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigate('/');
    });
  }

  // Wire up Help modal
  if (helpBtn && helpModal) {
    const modalClose = helpModal.querySelector('.modal-close');

    const openHelpModal = () => {
      helpModal.classList.remove('hidden');
    };

    const closeHelpModal = () => {
      helpModal.classList.add('hidden');
    };

    helpBtn.addEventListener('click', openHelpModal);
    modalClose?.addEventListener('click', closeHelpModal);

    // Close modal on backdrop click
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        closeHelpModal();
      }
    });

    // Close modals on Escape key
    const escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!helpModal.classList.contains('hidden')) {
          closeHelpModal();
        }
        if (newGameModal && !newGameModal.classList.contains('hidden')) {
          newGameModal.classList.add('hidden');
        }
      }
    };

    document.addEventListener('keydown', escapeHandler);

    // Store cleanup function
    currentCleanup = () => {
      document.removeEventListener('keydown', escapeHandler);
    };
  }
}

// Render dice demo
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
