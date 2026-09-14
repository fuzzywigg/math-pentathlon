/**
 * Overnight HEAVY leftover after #229 — Pent preview valid vs invalid fills. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, setPreviewPosition } from '../../src/games/pent-em-in/rules';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — preview fills', () => {
  it('valid preview uses player color; OOB/invalid uses red fill', () => {
    let state = selectPiece(createInitialState(), 'I5');
    state = setPreviewPosition(state, { row: 0, col: 0 });
    const validSvg = renderBoard(state, () => undefined, () => undefined);
    const validRects = validSvg.querySelectorAll('.preview rect');
    expect(validRects.length).toBeGreaterThan(0);
    expect([...validRects].every((r) => r.getAttribute('fill') !== '#ff5252')).toBe(true);

    state = setPreviewPosition(state, { row: 9, col: 9 });
    const badSvg = renderBoard(state, () => undefined, () => undefined);
    const badRects = badSvg.querySelectorAll('.preview rect');
    // corner may clip some cells OOB; any remaining in-bounds should be invalid red
    expect(badRects.length).toBeGreaterThan(0);
    expect([...badRects].every((r) => r.getAttribute('fill') === '#ff5252')).toBe(true);
  });
});
