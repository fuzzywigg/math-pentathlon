/**
 * Overnight TOKENMAXX HEAVY — prime-gold dice placeholders leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderDice, renderExpressions } from '../../src/games/prime-gold/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight prime — dice placeholders + empty exprs', () => {
  it('null diceRoll shows three ? placeholders and roll button', () => {
    const state = createInitialState();
    const el = renderDice(state, () => {});
    const dice = el.querySelectorAll('.pg-die');
    expect(dice.length).toBe(3);
    expect([...dice].every((d) => d.textContent === '?')).toBe(true);
    expect(el.querySelector('.pg-roll-btn')).toBeTruthy();
  });

  it('rolling phase expressions list has title but no items', () => {
    const el = renderExpressions(createInitialState(), () => {});
    expect(el.querySelector('h3')?.textContent).toMatch(/Valid Moves/i);
    expect(el.querySelectorAll('.pg-expr-item').length).toBe(0);
  });
});
