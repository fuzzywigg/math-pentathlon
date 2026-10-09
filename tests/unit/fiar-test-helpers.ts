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
 * under gapped-line rules on the verified 40-space board.
 */
export const SAFE_PLACEMENT_TO_MOVEMENT = [
  'c5r1',
  'c4r0',
  'c1r3',
  'c7r2',
  'c6r2',
  'c6r1',
  'c4r1',
  'c3r1',
  'c4r4',
  'c4r6',
  'c3r0',
  'c5r0',
  'c4r5',
  'c5r6',
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

export function placeToMovement(
  state: FiarGameState = createInitialState()
): FiarGameState {
  return placeMany(state, [...SAFE_PLACEMENT_TO_MOVEMENT]);
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

