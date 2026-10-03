// FIAR Game Controller — Division II rules + kid-friendly auto-win / no timer

import {
  FiarGameState,
  Player,
  ChipKind,
  createInitialState,
  CONFIG,
  chipsRemaining,
} from './types';
import {
  canPlaceChip,
  placeChip,
  selectChip,
  moveChip,
  getValidMoves,
  isDraw,
  setSelectedChipKind,
  normalizeSelectedChipKind,
} from './rules';
import {
  renderBoard,
  injectFiarStyles,
  getPlayerName,
} from './board-ui';
import { getAIMove, applyAIMove, AIDifficulty } from './ai';
import { tutorialManager } from '../../core/tutorial';
import { fiarTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { applyGameModeChrome } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

function syncOpponentChrome(): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

let gameState: FiarGameState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIMode = false;
/** Seat controlled by the computer in vs-AI mode. */
let aiPlayer: Player = 'player2';
let aiDifficulty: AIDifficulty = 'medium';
let hasNotifiedGameEnd = false;
let moveCount = 0;
let showStarterBanner = false;

function render(): void {
  if (!boardContainer || !statusContainer) return;

  boardContainer.innerHTML = '';
  const svg = renderBoard(gameState, handleNodeClick);
  boardContainer.appendChild(svg);

  renderStatus();
}

function inventoryLine(player: Player): string {
  const inv = gameState.chipInventory[player];
  const placed = gameState.chipsPlaced[player];
  return `${getPlayerName(player)}: ${placed}/${CONFIG.CHIPS_PER_PLAYER} (${inv.plain} plain, ${inv.marked} marked)`;
}

function renderChipKindPicker(): string {
  if (gameState.phase !== 'placement' || gameState.winner) return '';
  if (isAIMode && gameState.currentPlayer === aiPlayer) return '';

  const inv = gameState.chipInventory[gameState.currentPlayer];
  const plainPressed = gameState.selectedChipKind === 'plain';
  const markedPressed = gameState.selectedChipKind === 'marked';

  return `
    <div class="fiar-chip-kind-picker" role="group" aria-label="Choose chip type to place">
      <button type="button" class="fiar-chip-kind-btn" data-chip-kind="plain"
        aria-pressed="${plainPressed}" ${inv.plain <= 0 ? 'disabled' : ''}>
        Plain (${inv.plain} left)
      </button>
      <button type="button" class="fiar-chip-kind-btn" data-chip-kind="marked"
        aria-pressed="${markedPressed}" ${inv.marked <= 0 ? 'disabled' : ''}>
        Marked · yellow dot (${inv.marked} left)
      </button>
    </div>
  `;
}

function bindChipKindPicker(): void {
  if (!statusContainer) return;
  statusContainer.querySelectorAll<HTMLButtonElement>('[data-chip-kind]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.getAttribute('data-chip-kind') as ChipKind | null;
      if (kind !== 'plain' && kind !== 'marked') return;
      gameState = setSelectedChipKind(gameState, kind);
      render();
    });
  });
}

function renderStatus(): void {
  if (!statusContainer) return;
  markStatusLive(statusContainer);

  const { phase, currentPlayer, winner, selectedNode, starter } = gameState;

  if (winner) {
    const pathNote =
      gameState.winningPathColor && gameState.winningPathColor !== winner
        ? ` (with ${getPlayerName(gameState.winningPathColor)}'s chips)`
        : '';
    statusContainer.innerHTML = `
      <div class="fiar-winner-banner">
        ${getPlayerName(winner)} wins!${pathNote}
      </div>
    `;
    return;
  }

  if (isDraw(gameState)) {
    statusContainer.innerHTML = `
      <div class="fiar-status">
        Draw! No valid moves available.
      </div>
    `;
    return;
  }

  const starterBanner =
    showStarterBanner && moveCount === 0
      ? `<div class="fiar-starter-banner" data-starter="${starter}">
          ${getPlayerName(starter)} starts${
            isAIMode
              ? starter === aiPlayer
                ? ' (computer)'
                : ' (you)'
              : ''
          }.
        </div>`
      : '';

  let statusText = '';
  const playerClass = currentPlayer;
  const name = getPlayerName(currentPlayer);

  if (phase === 'placement') {
    const inv = gameState.chipInventory[currentPlayer];
    const remaining = chipsRemaining(inv);
    statusText = `${name}'s turn: Place a chip (${remaining} left)`;
  } else if (phase === 'movement') {
    if (selectedNode) {
      statusText = `${name}'s turn: Click a green node to move, or click chip again to deselect`;
    } else {
      statusText = `${name}'s turn: Select a chip to move`;
    }
  }

  statusContainer.innerHTML = `
    ${starterBanner}
    <div class="fiar-status ${playerClass}">
      ${statusText}
    </div>
    ${renderChipKindPicker()}
    <div class="fiar-chips-info">
      <div class="fiar-chip-count">
        <span class="fiar-chip-icon player1"></span>
        ${inventoryLine('player1')}
      </div>
      <div class="fiar-chip-count">
        <span class="fiar-chip-icon player2"></span>
        ${inventoryLine('player2')}
      </div>
    </div>
  `;
  bindChipKindPicker();
}

function notifyGameEndIfNeeded(): void {
  if (gameState.winner && !hasNotifiedGameEnd) {
    hasNotifiedGameEnd = true;
    owlSystem.onGameEnd('fiar', {
      winner: gameState.winner,
      moveCount,
    });
  }
}

function scheduleAiIfNeeded(): void {
  if (
    isAIMode &&
    gameState.currentPlayer === aiPlayer &&
    !gameState.winner &&
    gameState.phase !== 'gameOver'
  ) {
    setTimeout(aiTurn, 500);
  }
}

function handleNodeClick(nodeId: string): void {
  if (gameState.winner) return;
  if (isAIMode && gameState.currentPlayer === aiPlayer) return;

  const { phase, selectedNode } = gameState;

  if (phase === 'placement') {
    gameState = normalizeSelectedChipKind(gameState);
    if (canPlaceChip(gameState, nodeId)) {
      gameState = placeChip(gameState, nodeId);
      moveCount++;
      showStarterBanner = false;
      render();
      notifyGameEndIfNeeded();
      scheduleAiIfNeeded();
    }
  } else if (phase === 'movement') {
    const node = gameState.board.nodes.get(nodeId);

    if (selectedNode) {
      const validMoves = getValidMoves(gameState, selectedNode);

      if (validMoves.includes(nodeId)) {
        gameState = moveChip(gameState, selectedNode, nodeId);
        moveCount++;
        showStarterBanner = false;
        render();
        notifyGameEndIfNeeded();
        scheduleAiIfNeeded();
      } else if (node?.chip === gameState.currentPlayer) {
        gameState = selectChip(gameState, nodeId);
        render();
      } else if (nodeId === selectedNode) {
        gameState = selectChip(gameState, nodeId);
        render();
      }
    } else if (node?.chip === gameState.currentPlayer) {
      const validMoves = getValidMoves(gameState, nodeId);
      if (validMoves.length > 0) {
        gameState = selectChip(gameState, nodeId);
        render();
      }
    }
  }
}

function aiTurn(): void {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) return;

  const aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);
  if (aiMove) {
    gameState = applyAIMove(gameState, aiMove);
    moveCount++;
    showStarterBanner = false;
    render();
    notifyGameEndIfNeeded();
    // Human's turn next (or game over)
  }
}

export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  injectFiarStyles();
  boardContainer = boardEl;
  statusContainer = statusEl;
  gameState = createInitialState();
  isAIMode = false;
  aiPlayer = 'player2';
  showStarterBanner = false;
  syncOpponentChrome();
  render();
}

export function newGameVsHuman(): void {
  gameState = createInitialState({ starter: 'player1' });
  isAIMode = false;
  aiPlayer = 'player2';
  syncOpponentChrome();
  hasNotifiedGameEnd = false;
  moveCount = 0;
  showStarterBanner = true;
  render();
  owlSystem.onGameStart('fiar');
}

/**
 * Vs computer: random first player (PDF start). Seat colors stay
 * player1=Blue / player2=Red via getPlayerSeatColors().
 */
export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  const starter: Player = Math.random() < 0.5 ? 'player1' : 'player2';
  // Human keeps Blue (player1); computer is Red (player2) — random who moves first.
  aiPlayer = 'player2';
  gameState = createInitialState({ starter });
  isAIMode = true;
  syncOpponentChrome();
  aiDifficulty = difficulty;
  hasNotifiedGameEnd = false;
  moveCount = 0;
  showStarterBanner = true;
  render();
  owlSystem.onGameStart('fiar');

  if (gameState.currentPlayer === aiPlayer) {
    setTimeout(aiTurn, 500);
  }
}

export function getCurrentState(): FiarGameState {
  return gameState;
}

/** Test hook: set chip kind for the next placement. */
export function selectChipKindForTest(kind: ChipKind): void {
  gameState = setSelectedChipKind(gameState, kind);
  render();
}

export function startTutorial(): void {
  newGameVsHuman();

  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      if (event.type === 'completed') {
        newGameVsHuman();
      }
    }
  });

  tutorialManager.start(fiarTutorial);
}

export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
