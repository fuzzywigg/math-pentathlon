/**
 * Wave 43 — Hex-a-Gone committed selection rejects mutate. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  deselectBlock,
  selectBlock as sel,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — committed reject', () => {
  it('after commit, select/deselect are identity', () => {
    const committed = commitSelection(selectBlock(createInitialState(), 'rhombus'));
    expect(sel(committed, 'triangle')).toBe(committed);
    expect(deselectBlock(committed, 'rhombus')).toBe(committed);
  });
});
