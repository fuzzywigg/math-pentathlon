/**
 * Wave 43 — select/deselect after commit identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — select committed reject', () => {
  it('after commit, selectBlock/deselectBlock are identity', () => {
    let s = createInitialState();
    s = selectBlock(s, 'rhombus');
    s = commitSelection(s);
    expect(selectBlock(s, 'triangle')).toBe(s);
    expect(deselectBlock(s, 'rhombus')).toBe(s);
  });
});
