/**
 * Wave 49 — Handshake createInitialState openings for four engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { createInitialState as createKwatro } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createPar } from '../../src/games/par-55/rules';

describe('Wave 49 handshake — openings', () => {
  it('four engines open with p1 to move and no winner', () => {
    const q = createQueens();
    const f = createFiar();
    const k = createKwatro();
    const p = createPar();
    expect(q.currentPlayer).toBe('player1');
    expect(f.currentPlayer).toBe('player1');
    expect(k.currentPlayer).toBe('player1');
    expect(p.currentPlayer).toBe('player1');
    expect(q.winner).toBeNull();
    expect(f.winner).toBeNull();
    expect(k.winner).toBeNull();
    expect(p.winner).toBeNull();
  });
});
