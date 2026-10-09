// FIAR Game Controller — Division II rules + kid-friendly auto-win / no timer

import {
  type FiarGameState,
  type Player,
  type ChipKind,
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
import { renderBoard, injectFiarStyles, getPlayerName } from './board-ui';
import { type AIDifficulty, applyAIMove, getAIMove } from './ai';
import {
  cancelFiarAiRequests,
  disposeFiarAiWorker,
  getAIMoveAsync,
} from './ai-client';
import { tutorialManager } from '../../core/tutorial';
import { fiarTutorial } from './tutorial';
import { owlSystem } from '../../core/owl';
import { syncAppOpponentChrome } from '../../ui/player-colors';
import { clearNullableTimeout } from '../../ui/timeout-handle';
import { markStatusLive } from '../../ui/board-a11y';
import { isBoard3dEnabled } from '../../core/feature-flags';
import {
  markBoard3dWebGlFallback,
  clearBoard3dWebGlFallback,
} from '../../ui/three/tablet-gl';
import { loadFiarBoard3DModule } from './board-3d-loader';
import type { FiarBoard3D } from '../../ui/three/fiar-board-3d';

import {
  clearElement,
  replaceWithSafeHtml,
  safeHtml,
} from '../../core/dom-security';

function syncOpponentChrome(): void {
  syncAppOpponentChrome(isAIMode ? 'human-vs-ai' : 'human-vs-human');
}

let gameState: FiarGameState;
let boardContainer: HTMLElement | null = null;
let statusContainer: HTMLElement | null = null;
let isAIMode = false;
/** Seat controlled by the computer in vs-AI mode. */
let aiPlayer: Player = 'player2';
let aiDifficulty: AIDifficulty = 'medium';
/** Invalidates in-flight worker replies after new game / leave. */
let aiGeneration = 0;
/** Single pending AI schedule timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
/** True while a worker/sync AI search is in flight — blocks human taps. */
let isAIThinking = false;

function clearAiTimer(): void {
  aiTimer = clearNullableTimeout(aiTimer);
}
let hasNotifiedGameEnd = false;
let moveCount = 0;
let showStarterBanner = false;

let board3d: FiarBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;

function unmountBoard3d(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
}

async function ensureBoard3d(): Promise<void> {
  if (!boardContainer || board3d || !board3dEnabled) {
    return;
  }
  try {
    const mod = await loadFiarBoard3DModule();
    if (!boardContainer || !board3dEnabled) {
      return;
    }
    board3d = await mod.createFiarBoard3D(boardContainer, handleNodeClick);
    clearBoard3dWebGlFallback(boardContainer);
    boardContainer.addEventListener('mp3d-context-lost', onBoard3dContextLost);
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    markBoard3dWebGlFallback(boardContainer, 'webgl-unavailable');
    board3d = null;
    board3dEnabled = false;
  }
}

function onBoard3dContextLost(): void {
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
  board3d = null;
  markBoard3dWebGlFallback(boardContainer, 'context-lost');
  board3dEnabled = false;
  board3dLoading = null;
  render();
}

function render(): void {
  if (!boardContainer || !statusContainer) {
    return;
  }

  if (board3dEnabled && board3d) {
    board3d.update(gameState, handleNodeClick);
  } else if (!board3dEnabled) {
    clearElement(boardContainer);
    const svg = renderBoard(gameState, handleNodeClick);
    boardContainer.appendChild(svg);
  }

  renderStatus();
}

function inventoryLine(player: Player): string {
  const inv = gameState.chipInventory[player];
  const placed = gameState.chipsPlaced[player];
  return `${getPlayerName(player)}: ${placed}/${CONFIG.CHIPS_PER_PLAYER} (${inv.plain} plain, ${inv.marked} marked)`;
}

function renderChipKindPicker(): DocumentFragment | null {
  if (gameState.phase !== 'placement' || gameState.winner) {
    return null;
  }
  if (isAIMode && gameState.currentPlayer === aiPlayer) {
    return null;
  }

  const inv = gameState.chipInventory[gameState.currentPlayer];
  const plainPressed = gameState.selectedChipKind === 'plain';
  const markedPressed = gameState.selectedChipKind === 'marked';

  const picker = document.createElement('div');
  picker.className = 'fiar-chip-kind-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Choose chip type to place');

  const plainBtn = document.createElement('button');
  plainBtn.type = 'button';
  plainBtn.className = 'fiar-chip-kind-btn';
  plainBtn.dataset.chipKind = 'plain';
  plainBtn.setAttribute('aria-pressed', String(plainPressed));
  if (inv.plain <= 0) {
    plainBtn.disabled = true;
  }
  plainBtn.textContent = `Plain (${inv.plain} left)`;

  const markedBtn = document.createElement('button');
  markedBtn.type = 'button';
  markedBtn.className = 'fiar-chip-kind-btn';
  markedBtn.dataset.chipKind = 'marked';
  markedBtn.setAttribute('aria-pressed', String(markedPressed));
  if (inv.marked <= 0) {
    markedBtn.disabled = true;
  }
  markedBtn.textContent = `Marked · Fire Extinguisher (${inv.marked} left)`;

  picker.appendChild(plainBtn);
  picker.appendChild(markedBtn);
  const frag = document.createDocumentFragment();
  frag.appendChild(picker);
  return frag;
}

function bindChipKindPicker(): void {
  if (!statusContainer) {
    return;
  }
  statusContainer
    .querySelectorAll<HTMLButtonElement>('[data-chip-kind]')
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.getAttribute('data-chip-kind') as ChipKind | null;
        if (kind !== 'plain' && kind !== 'marked') {
          return;
        }
        gameState = setSelectedChipKind(gameState, kind);
        render();
      });
    });
}

function renderStatus(): void {
  if (!statusContainer) {
    return;
  }
  markStatusLive(statusContainer);

  const { phase, currentPlayer, winner, selectedNode, starter } = gameState;

  if (winner) {
    const pathNote =
      gameState.winningPathColor && gameState.winningPathColor !== winner
        ? ` (with ${getPlayerName(gameState.winningPathColor)}'s chips)`
        : '';
    replaceWithSafeHtml(
      statusContainer,
      safeHtml`
      <div class="fiar-winner-banner">
        ${getPlayerName(winner)} wins!${pathNote}
      </div>
    `
    );
    return;
  }

  if (isDraw(gameState)) {
    // trusted constant markup
    statusContainer.innerHTML = `
      <div class="fiar-status">
        Draw! No valid moves available.
      </div>
    `;
    return;
  }

  let statusText = '';
  const playerClass = currentPlayer;
  const name = getPlayerName(currentPlayer);

  if (isAIThinking) {
    statusText = `${name}'s turn: Computer is thinking…`;
  } else if (phase === 'placement') {
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

  clearElement(statusContainer);

  if (showStarterBanner && moveCount === 0) {
    const banner = document.createElement('div');
    banner.className = 'fiar-starter-banner';
    banner.dataset.starter = starter;
    const modeNote = isAIMode
      ? starter === aiPlayer
        ? ' (computer)'
        : ' (you)'
      : '';
    banner.textContent = `${getPlayerName(starter)} starts${modeNote}.`;
    statusContainer.appendChild(banner);
  }

  const statusEl = document.createElement('div');
  statusEl.className = `fiar-status ${playerClass}${isAIThinking ? ' status-ai-thinking' : ''}`;
  statusEl.textContent = statusText;
  statusContainer.appendChild(statusEl);

  const picker = renderChipKindPicker();
  if (picker) {
    statusContainer.appendChild(picker);
  }

  statusContainer.appendChild(
    safeHtml`
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
  `
  );
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
    clearAiTimer();
    aiTimer = setTimeout(() => {
      aiTimer = null;
      void aiTurn();
    }, 500);
  }
}

function handleNodeClick(nodeId: string): void {
  if (gameState.winner) {
    return;
  }
  if (isAIThinking) {
    return;
  }
  if (isAIMode && gameState.currentPlayer === aiPlayer) {
    return;
  }

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

async function aiTurn(): Promise<void> {
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) {
    return;
  }

  // Movement jam: surface Draw immediately — do not leave the seat spinning.
  if (isDraw(gameState)) {
    isAIThinking = false;
    render();
    return;
  }

  const gen = ++aiGeneration;
  isAIThinking = true;
  render();

  let aiMove;
  try {
    aiMove = await getAIMoveAsync(gameState, aiPlayer, aiDifficulty);
  } catch {
    aiMove = null;
  }

  // Worker cancel / rare failure: sync search so the human seat is never soft-locked.
  if (!aiMove && gen === aiGeneration) {
    try {
      aiMove = getAIMove(gameState, aiPlayer, aiDifficulty);
    } catch {
      aiMove = null;
    }
  }

  if (gen !== aiGeneration) {
    return;
  }
  isAIThinking = false;
  if (gameState.winner || gameState.currentPlayer !== aiPlayer) {
    render();
    return;
  }

  if (aiMove) {
    gameState = applyAIMove(gameState, aiMove);
    moveCount++;
    showStarterBanner = false;
    render();
    notifyGameEndIfNeeded();
    // Human's turn next (or game over)
  } else {
    // No legal move (draw) or search exhausted — re-render so Draw chrome appears.
    render();
  }
}

export function setAIDifficulty(difficulty: AIDifficulty): void {
  aiDifficulty = difficulty;
}

export function initGame(boardEl: HTMLElement, statusEl: HTMLElement): void {
  injectFiarStyles();
  unmountBoard3d();
  boardContainer = boardEl;
  statusContainer = statusEl;
  gameState = createInitialState();
  isAIMode = false;
  aiPlayer = 'player2';
  showStarterBanner = false;
  syncOpponentChrome();

  board3dEnabled = isBoard3dEnabled();
  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      render();
    });
  }

  render();
}

/** Dispose 3D resources and clear mounts (route change). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  isAIThinking = false;
  cancelFiarAiRequests();
  disposeFiarAiWorker();
  if (boardContainer) {
    boardContainer.removeEventListener(
      'mp3d-context-lost',
      onBoard3dContextLost
    );
  }
  unmountBoard3d();
  boardContainer = null;
  statusContainer = null;
}

/** Whether the live controller is using the 3D board path. */
export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

/** Await pending 3D mount (tests / callers that need the canvas ready). */
export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

export function newGameVsHuman(): void {
  aiGeneration += 1;
  isAIThinking = false;
  cancelFiarAiRequests();
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
  aiGeneration += 1;
  isAIThinking = false;
  cancelFiarAiRequests();
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

  // Route opening AI seat through the tracked timer so destroyGame/clearAiTimer
  // can cancel it (raw setTimeout previously survived remount).
  scheduleAiIfNeeded();
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
