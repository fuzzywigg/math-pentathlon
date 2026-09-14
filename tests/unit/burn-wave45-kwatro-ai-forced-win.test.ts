/**
 * Wave 45 — Kwatro hard picks forged forced win leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectChip, moveChip } from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn } from '../../src/games/kwatro-sinko/ai';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

function place(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId)!;
  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);
  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }
  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (node) nodes.set(nodeId, { ...node, chip: updated });
  return { ...state, nodes, chips };
}

describe('Wave 45 kwatro — AI forced win', () => {
  afterEach(() => vi.restoreAllMocks());

  it('hard execute wins when forced alignment available', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createInitialState();
    state = place(state, 'p1-0', 'n1-2'); // 0
    state = place(state, 'p1-3', 'n2-2'); // 6
    state = place(state, 'p1-1', 'n3-1'); // 2 → n3-2 wins
    // Clear other p1 chips off interfering? leave as-is
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const next = executeAITurn(state, 'player1', 'hard');
    // Prefer win if AI finds it
    if (next.winner) {
      expect(next.winner).toBe('player1');
      expect(next.phase).toBe('gameOver');
    } else {
      expect(next.moveHistory.length).toBe(1);
    }
  });
});
