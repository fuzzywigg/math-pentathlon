/**
 * Wave 49 — Par55 hand block label abbrev leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand labels', () => {
  it('labels blocks with size/thickness initials', () => {
    const s = createInitialState();
    const el = renderHand(s, 'player1', () => undefined);
    const labels = [...el.querySelectorAll('.par55-block-label')].map((n) => n.textContent);
    expect(labels.length).toBe(s.hands.player1.length);
    for (const [i, block] of s.hands.player1.entries()) {
      expect(labels[i]).toBe(`${block.size[0]!.toUpperCase()}/${block.thickness[0]!.toUpperCase()}`);
    }
  });
});
