/**
 * Shared seat display labels for 2P Blue/Red and vs-AI You/Computer|AI copy.
 * Pure UI glue — does not change rules text beyond consolidating identical helpers.
 */

export type SeatId = 'player1' | 'player2';
export type GameModeLabel = 'human-vs-human' | 'human-vs-ai';

/**
 * Classic 2P seat names used by nearly every board-ui `getPlayerName`.
 * Optional `vsAI` matches Stars & Bars (You / Computer).
 */
export function getPlayerName(player: SeatId, vsAI: boolean = false): string {
  if (vsAI) {
    return player === 'player1' ? 'You' : 'Computer';
  }
  return player === 'player1' ? 'Blue' : 'Red';
}

/**
 * Winner / turn seat label used by Hex-a-Gone and Star Track status
 * (vs-AI uses "AI", not "Computer").
 */
export function formatModeSeatLabel(
  player: SeatId,
  mode: GameModeLabel
): string {
  if (mode === 'human-vs-ai') {
    return player === 'player1' ? 'You' : 'AI';
  }
  return player === 'player1' ? 'Blue' : 'Red';
}

/**
 * Fraction Pinball-style seat label (vs-AI uses "Computer").
 */
export function formatModeSeatLabelComputer(
  player: SeatId,
  mode: GameModeLabel
): string {
  if (mode === 'human-vs-ai') {
    return player === 'player1' ? 'You' : 'Computer';
  }
  return player === 'player1' ? 'Blue' : 'Red';
}

/** Flip player1 ↔ player2 (identical across game `types.ts` helpers). */
export function getOpponentSeat<T extends SeatId>(player: T): T {
  return (player === 'player1' ? 'player2' : 'player1') as T;
}
