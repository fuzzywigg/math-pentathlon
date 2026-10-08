/**
 * Shared seat identity helpers for rules/engines.
 * Lives in core (not UI) so game types/rules never import src/ui.
 */

export type SeatId = 'player1' | 'player2';

/** Flip player1 ↔ player2 (identical across game `types.ts` helpers). */
export function getOpponentSeat<T extends SeatId>(player: T): T {
  return (player === 'player1' ? 'player2' : 'player1') as T;
}
