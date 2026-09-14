/**
 * Wave 41 — handshake: star-track progress vs alignment normalize.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
} from '../../src/games/star-track/rules';
import { normalizePosition } from '../../src/core/alignment';

describe('Wave 41 handshake — star × align', () => {
  it('progress maps into track dims via normalize', () => {
    let state = drawChains(createInitialState());
    state = selectChain(state, 0);
    const p = getProgress(state, 'player1');
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(100);
    const pos = normalizePosition(
      { row: state.player1Position, col: 0 },
      { rows: TRACK_LENGTH + 1, cols: 1 },
      {}
    );
    expect(pos.row).toBe(state.player1Position);
  });
});
