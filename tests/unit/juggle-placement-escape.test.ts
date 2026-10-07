/**
 * Playtest recheck: Juggle placement soft-lock escape (no rules change).
 * Orient-to-fit + abandonPlacement keep kids from dead-ending on a jammed shape.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  createInitialState,
  selectDie,
  selectShape,
  abandonPlacement,
  selectedShapeFitsAnywhere,
  getCurrentOrientationPlacements,
  doRollDice,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('juggle placement soft-lock escape', () => {
  it('abandonPlacement returns to die/shape selection without changing boards', () => {
    let state = createInitialState();
    state = {
      ...state,
      phase: 'placing',
      currentDice: [3, 1],
      selectedCategory: 'tromino',
      selectedShape: SHAPE_POOLS.tromino[0]!,
    };
    const boards = state.boards;
    const next = abandonPlacement(state);
    expect(next.phase).toBe('selectingShape');
    expect(next.selectedShape).toBeNull();
    expect(next.selectedCategory).toBeNull();
    expect(next.boards).toBe(boards);
    expect(next.currentDice).toEqual([3, 1]);
  });

  it('selectShape orients to a fitting rotation when possible', () => {
    let state = createInitialState();
    // Force dice then pick tromino category with multiple shapes
    vi.spyOn(Math, 'random').mockReturnValue(2 / 6); // die face 3
    state = doRollDice(state);
    state = selectDie(state, 0);
    expect(state.selectedCategory).toBe('tromino');
    const shape = SHAPE_POOLS.tromino[0]!;
    state = selectShape(state, shape);
    expect(state.phase).toBe('placing');
    expect(selectedShapeFitsAnywhere(state)).toBe(true);
    expect(getCurrentOrientationPlacements(state).length).toBeGreaterThan(0);
  });

  it('shape controls expose Choose another escape when allowInput', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
    let abandoned = false;
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: SHAPE_POOLS.tromino[0],
        selectedCategory: 'tromino',
        currentDice: [3, 1],
      },
      () => undefined,
      () => undefined,
      { onAbandonPlacement: () => {
        abandoned = true;
      } }
    );
    const btn = el.querySelector(
      '.juggle-choose-other-btn'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    btn.click();
    expect(abandoned).toBe(true);
  });
});
