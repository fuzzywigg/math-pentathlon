/**
 * Wave 57 leftover after #267 — Prime empty prime-cell aria extras.
 * Distinct from wave50 prime class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 57 prime — prime aria extra', () => {
  it('announces value, empty, prime on unowned prime cell', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const prime = el.querySelector('.pg-cell.prime') as HTMLElement;
    expect(prime).toBeTruthy();
    const value = prime.getAttribute('data-value');
    expect(prime.getAttribute('aria-label')).toBe(`${value}, empty, prime`);
  });
});
