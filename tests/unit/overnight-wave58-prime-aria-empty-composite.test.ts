/**
 * Wave 58 leftover after #267 — Prime empty non-prime (composite) aria.
 * Distinct from empty prime leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — empty composite aria', () => {
  it('announces value, empty without prime extra on composite', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const cell = el.querySelector('.pg-cell[data-value="1"]')!;
    expect(cell.getAttribute('aria-label')).toBe('1, empty');
    expect(cell.getAttribute('aria-label') ?? '').not.toMatch(/prime/);
  });
});
