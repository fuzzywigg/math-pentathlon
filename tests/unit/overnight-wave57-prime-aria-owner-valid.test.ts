/**
 * Wave 57 leftover after #267 — Prime owned Blue + valid-placement aria.
 * Distinct from wave50 owner class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 57 prime — owner + valid aria', () => {
  it('owned Blue aria includes Blue; valid empty includes valid placement', () => {
    const state = createInitialState();
    const owned = state.cells.get('0,0');
    expect(owned).toBeTruthy();
    state.cells.set('0,0', {
      ...owned!,
      owner: 'player1',
      isPrime: true,
    });
    state.phase = 'placing';
    state.diceRoll = { die1: 1, die2: 2, die3: 3 };
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);

    const el = renderBoard(state, () => undefined);
    const ownedEl = el.querySelector('.pg-cell[data-row="0"][data-col="0"]')!;
    expect(ownedEl.getAttribute('aria-label') ?? '').toMatch(/Blue/);
    expect(ownedEl.getAttribute('aria-label') ?? '').toMatch(/prime/);

    const valid = el.querySelector('.pg-cell.valid') as HTMLElement;
    expect(valid).toBeTruthy();
    expect(valid.getAttribute('aria-label') ?? '').toMatch(/valid placement$/);
  });
});
