/**
 * Wave 58 leftover after #267 — Prime empty prime aria.
 * Distinct from wave56 history Red leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — empty prime aria', () => {
  it('announces value, empty, prime on unowned prime cell', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const cell = el.querySelector('.pg-cell[data-value="2"]')!;
    expect(cell.getAttribute('aria-label')).toBe('2, empty, prime');
  });
});
