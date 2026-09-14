/**
 * Overnight TOKENMAXX HEAVY — prime-gold owned prime class leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight prime — owned prime class', () => {
  it('owned prime cell has player1 and prime classes', () => {
    const open = createInitialState();
    const cells = new Map(open.cells);
    let primeKey = null;
    for (const [key, cell] of cells) {
      if (cell.isPrime) { primeKey = key; break; }
    }
    expect(primeKey).not.toBeNull();
    const cell = cells.get(primeKey!)!;
    cells.set(primeKey!, { ...cell, owner: 'player1' });
    const board = renderBoard({ ...open, cells }, () => {});
    const el = board.querySelector(`.pg-cell[data-value="${cell.value}"]`);
    expect(el?.classList.contains('player1')).toBe(true);
    expect(el?.classList.contains('prime')).toBe(true);
  });
});
