/**
 * Wave 49 — Handshake opening phase matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { createInitialState as createKwatro } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createPar } from '../../src/games/par-55/rules';

describe('Wave 49 handshake — phase matrix', () => {
  it('documents distinct opening phases', () => {
    expect(createFiar().phase).toBe('placement');
    expect(createKwatro().phase).toBe('selectingChip');
    expect(createPar().phase).toBe('selectingBlock');
  });
});
