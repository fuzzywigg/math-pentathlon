/**
 * Player seat colors for 2P (blue/red) vs vs-AI (human blue/red, AI purple).
 * Mode chrome lives on the game shell container via data-game-mode / data-ai-seat.
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
 * Stamp vs-AI / 2P chrome on the shell container so CSS and board-uis can branch.
 * Default AI seat is player2; Kings may pass player1 when the human plays second.
 */
export function applyGameModeChrome(
  container: HTMLElement,
  mode: GameModeChrome,
  aiSeat: PlayerSeat = 'player2'
): void {
  const isAi = mode === 'human-vs-ai';
  container.dataset.gameMode = isAi ? 'ai' : 'human';
  container.classList.toggle('game-vs-ai', isAi);
  if (isAi) {
    container.dataset.aiSeat = aiSeat;
  } else {
    delete container.dataset.aiSeat;
  }
}

export function clearGameModeChrome(container: HTMLElement): void {
  delete container.dataset.gameMode;
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
  const mode = el?.dataset.gameMode;
  const aiSeat = (el?.dataset.aiSeat as PlayerSeat | undefined) ?? 'player2';

  const player1Base = readRootVar('--color-player1', FALLBACK.player1);
  const player2Base = readRootVar('--color-player2', FALLBACK.player2);
  const ai = readRootVar('--color-ai', FALLBACK.ai);

  let player1 = player1Base;
  let player2 = player2Base;
  let player1Light: string = FALLBACK.player1Light;
  let player2Light: string = FALLBACK.player2Light;

  if (mode === 'ai') {
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
