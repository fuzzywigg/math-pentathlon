/**
 * Player seat colors for 2P (blue/red) vs vs-AI (human blue/red, AI purple).
 * Mode chrome: `#app[data-opponent="ai"]` (+ optional `data-ai-seat` for Kings flip).
 */

export type PlayerSeat = 'player1' | 'player2';
export type GameModeChrome = 'human-vs-human' | 'human-vs-ai';

const FALLBACK = {
  player1: '#3b82f6',
  player2: '#ef4444',
  ai: '#8b5cf6',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  aiLight: '#ddd6fe',
} as const;

function readRootVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/**
 * Stamp vs-AI chrome on the shell (`#app`).
 * Sets `data-opponent="ai"` for vs-AI; clears it for 2P human.
 * Default AI seat is player2; Kings may pass player1 when the human plays second.
 */
export function applyGameModeChrome(
  container: HTMLElement,
  mode: GameModeChrome,
  aiSeat: PlayerSeat = 'player2'
): void {
  const isAi = mode === 'human-vs-ai';
  if (isAi) {
    container.dataset.opponent = 'ai';
    container.dataset.aiSeat = aiSeat;
    container.classList.add('game-vs-ai');
  } else {
    delete container.dataset.opponent;
    delete container.dataset.aiSeat;
    container.classList.remove('game-vs-ai');
  }
}

export function clearGameModeChrome(container: HTMLElement): void {
  delete container.dataset.opponent;
  delete container.dataset.aiSeat;
  container.classList.remove('game-vs-ai');
}

export function getGameModeChromeRoot(
  root?: HTMLElement | null
): HTMLElement | null {
  if (root) return root;
  if (typeof document === 'undefined') return null;
  return document.getElementById('app');
}

function isAiOpponent(el: HTMLElement | null | undefined): boolean {
  return el?.dataset.opponent === 'ai';
}

/**
 * Resolve paint colors for each seat.
 * vs-AI: AI seat → --color-ai purple; human seat → blue (P1) or red (P2).
 * 2P human: always blue / red.
 */
export function getPlayerSeatColors(root?: HTMLElement | null): {
  player1: string;
  player2: string;
  player1Light: string;
  player2Light: string;
} {
  const el = getGameModeChromeRoot(root);
  const aiSeat = (el?.dataset.aiSeat as PlayerSeat | undefined) ?? 'player2';

  const player1Base = readRootVar('--color-player1', FALLBACK.player1);
  const player2Base = readRootVar('--color-player2', FALLBACK.player2);
  const ai = readRootVar('--color-ai', FALLBACK.ai);

  let player1 = player1Base;
  let player2 = player2Base;
  let player1Light: string = FALLBACK.player1Light;
  let player2Light: string = FALLBACK.player2Light;

  if (isAiOpponent(el)) {
    if (aiSeat === 'player1') {
      player1 = ai;
      player1Light = FALLBACK.aiLight;
    } else {
      player2 = ai;
      player2Light = FALLBACK.aiLight;
    }
  }

  return { player1, player2, player1Light, player2Light };
}

export function colorForSeat(
  seat: PlayerSeat,
  root?: HTMLElement | null
): string {
  const colors = getPlayerSeatColors(root);
  return seat === 'player1' ? colors.player1 : colors.player2;
}

/** Blue / red / purple circle emoji for a seat (AI seat → purple). */
export function seatIcon(
  seat: PlayerSeat,
  root?: HTMLElement | null
): string {
  const el = getGameModeChromeRoot(root);
  const aiSeat = (el?.dataset.aiSeat as PlayerSeat | undefined) ?? 'player2';
  if (isAiOpponent(el) && seat === aiSeat) return '🟣';
  return seat === 'player1' ? '🔵' : '🔴';
}
