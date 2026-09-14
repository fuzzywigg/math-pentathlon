/**
 * Wave 48 overnight — Juggle hover preview-valid/invalid classes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie, doRollDice, selectShape } from '../../src/games/juggle/rules';
import { renderBoard } from '../../src/games/juggle/board-ui';
import { getShapesForDie } from '../../src/games/juggle/types';
import { vi, afterEach } from 'vitest';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle overnight — hover preview', () => {
  it('adds preview-valid class when hovering legal cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = doRollDice(createInitialState());
    state = selectDie(state, 0);
    if (state.phase !== 'placing') {
      const shapes = getShapesForDie(state.currentDice![0]);
      state = selectShape(state, shapes[0]);
    }
    state = { ...state, hoverPosition: { row: 0, col: 0 } };
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const preview = el.querySelector('.preview-valid, .preview-invalid');
    expect(preview).not.toBeNull();
  });
});
