/**
 * Wave 49 — Contig/SD/Star/Kings/Queens/FIAR openings handshake leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { createInitialState as createFiar } from '../../src/games/fiar/types';

describe('Wave 49 handshake — openings smoke', () => {
  it('six leftover engines open without winner', () => {
    expect(createContig().winner).toBeNull();
    expect(createSum().winner).toBeNull();
    expect(createStar().winner).toBeNull();
    expect(createKings().winner).toBeNull();
    expect(createQueens().winner).toBeNull();
    expect(createFiar().winner).toBeNull();
  });
});
