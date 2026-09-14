/**
 * Wave 48 overnight — Juggle shape controls rotate/flip gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeControls } from '../../src/games/juggle/board-ui';
import { getShapesForDie } from '../../src/games/juggle/types';

describe('Wave 48 juggle overnight — shape controls gates', () => {
  it('empty outside placing', () => {
    const el = renderShapeControls(createInitialState(), () => undefined, () => undefined);
    expect(el.querySelectorAll('button')).toHaveLength(0);
  });

  it('shows Rotate/Flip when shape allows', () => {
    const shapes = getShapesForDie(5);
    const flippable = shapes.find((s) => s.canFlip && s.canRotate) ?? shapes[0];
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: flippable,
      selectedCategory: 'pentomino' as const,
      currentDice: [5, 5] as [number, number],
    };
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = (() => ({
      clearRect() {},
      fillRect() {},
      strokeRect() {},
      beginPath() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
      fill() {},
      save() {},
      restore() {},
      translate() {},
      scale() {},
      setTransform() {},
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
    })) as unknown as typeof orig;
    try {
      const el = renderShapeControls(state, () => undefined, () => undefined);
      if (flippable.canRotate) expect(el.textContent).toMatch(/Rotate/);
      if (flippable.canFlip) expect(el.textContent).toMatch(/Flip/);
    } finally {
      HTMLCanvasElement.prototype.getContext = orig;
    }
  });
});
