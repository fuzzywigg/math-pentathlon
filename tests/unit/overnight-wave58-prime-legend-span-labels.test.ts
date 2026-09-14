/**
 * Wave 58 leftover after #267 — Prime legend span exact labels.
 * Distinct from wave50 swatch-class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — legend span labels', () => {
  it('exacts Prime / Blue / Red legend span copy', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const spans = [...el.querySelectorAll('.pg-legend-item span')].map(
      (s) => s.textContent?.trim()
    );
    expect(spans).toEqual(['Prime', 'Blue', 'Red']);
  });
});
