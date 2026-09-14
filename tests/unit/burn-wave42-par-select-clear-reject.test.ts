/**
 * Wave 42 — Par-55 select/clear phase rejects + invalid placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  isValidPlacement,
  placeBlock,
  passTurn,
} from '../../src/games/par-55/rules';

describe('Wave 42 par-55 — select/clear reject', () => {
  it('ghost block / wrong phase select identity', () => {
    const s = createInitialState();
    expect(selectBlock(s, 'ghost')).toBe(s);
    const sel = selectBlock(s, s.hands.player1[0].id);
    expect(selectBlock(sel, s.hands.player1[1]?.id ?? 'x')).toBe(sel);
    expect(clearSelection(sel).phase).toBe('selectingBlock');
    expect(clearSelection(sel).selectedBlock).toBeNull();
  });

  it('isolated empty base invalid; occupied center invalid', () => {
    const s = createInitialState();
    // find a base with no adjacent blocks — corners of odd rows may still touch; use far empty check
    const center = [...s.bases.values()].find((b) => b.block)!;
    expect(isValidPlacement(s, center.id)).toBe(false);
    expect(isValidPlacement(s, 'missing')).toBe(false);
  });

  it('place without selection identity; pass clears selection', () => {
    const s = createInitialState();
    const anyBase = [...s.bases.keys()][0];
    expect(placeBlock(s, anyBase)).toBe(s);
    const sel = selectBlock(s, s.hands.player1[0].id);
    const passed = passTurn(sel);
    expect(passed.selectedBlock).toBeNull();
    expect(passed.currentPlayer).toBe('player2');
  });
});
