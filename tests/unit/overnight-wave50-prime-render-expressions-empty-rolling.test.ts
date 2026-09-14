/**
 * Overnight HEAVY leftover after #229 — Prime Gold expressions empty while rolling. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderExpressions } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — expressions rolling', () => {
  it('shows Valid Moves header without pass or expr items', () => {
    const el = renderExpressions(createInitialState(), () => undefined);
    expect(el.classList.contains('pg-expressions')).toBe(true);
    expect(el.querySelector('h3')?.textContent).toBe('Valid Moves');
    expect(el.querySelectorAll('.pg-expr-item').length).toBe(0);
    expect(el.textContent).not.toMatch(/No valid moves/);
  });
});
