// Shared helpers for FIAR unit tests

import {
  FiarGameState,
  Player,
  ChipKind,
  createInitialState,
  CONFIG,
} from '../../src/games/fiar/types';
import { placeChip, forceChip } from '../../src/games/fiar/rules';

/**
 * 14 alternating placements that reach movement without an auto-detected win
 * under gapped-line rules (verified against the engine).
 */
export const SAFE_PLACEMENT_TO_MOVEMENT = [
  '2-3',
  '3-4',
  '0-0',
  '2-4',
  '1-3',
  '1-2',
  '3-3',
  '0-3',
  '2-0',
  '4-2',
  '3-0',
  '4-1',
  '3-1',
  '4-0',
] as const;

/** Place using the given kind, or auto-pick plain then marked from inventory. */
export function placeMany(
  state: FiarGameState,
  nodeIds: string[],
  kind?: ChipKind
): FiarGameState {
  let s = state;
  for (const id of nodeIds) {
    const inv = s.chipInventory[s.currentPlayer];
    const chosen: ChipKind =
      kind ??
      (inv.plain > 0 ? 'plain' : inv.marked > 0 ? 'marked' : 'plain');
    s = placeChip(s, id, chosen);
  }
  return s;
}

export function placeToMovement(state: FiarGameState = createInitialState()): FiarGameState {
  return placeMany(state, [...SAFE_PLACEMENT_TO_MOVEMENT]);
}

/** Place alternating turns with optional per-move kinds (defaults plain). */
export function placeSequence(
  state: FiarGameState,
  moves: Array<{ nodeId: string; kind?: ChipKind }>
): FiarGameState {
  let s = state;
  for (const m of moves) {
    s = placeChip(s, m.nodeId, m.kind ?? 'plain');
  }
  return s;
}

export function forgeMovementState(
  placements: Array<{ nodeId: string; player: Player; kind?: ChipKind }>
): FiarGameState {
  let s = createInitialState();
  const counts = { player1: 0, player2: 0 };
  const inv = {
    player1: {
      plain: CONFIG.PLAIN_CHIPS_PER_PLAYER,
      marked: CONFIG.MARKED_CHIPS_PER_PLAYER,
    },
    player2: {
      plain: CONFIG.PLAIN_CHIPS_PER_PLAYER,
      marked: CONFIG.MARKED_CHIPS_PER_PLAYER,
    },
  };

  for (const p of placements) {
    const kind = p.kind ?? 'plain';
    s = forceChip(s, p.nodeId, p.player, kind);
    counts[p.player]++;
    inv[p.player][kind] = Math.max(0, inv[p.player][kind] - 1);
  }

  return {
    ...s,
    phase: 'movement',
    chipsPlaced: counts,
    chipInventory: inv,
    currentPlayer: 'player1',
  };
}

/** Fill both inventories to empty via forged counts (movement phase). */
export function withEmptyHands(state: FiarGameState): FiarGameState {
  return {
    ...state,
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    chipInventory: {
      player1: { plain: 0, marked: 0 },
      player2: { plain: 0, marked: 0 },
    },
  };
}
