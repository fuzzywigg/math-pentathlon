/**
 * Wave 48 — Juggle shape selector mount when category set. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

describe('Wave 48 juggle — shape selector mount', () => {
  let orig: typeof HTMLCanvasElement.prototype.getContext;
  beforeEach(() => {
    orig = HTMLCanvasElement.prototype.getContext;
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
  });
  afterEach(() => {
    HTMLCanvasElement.prototype.getContext = orig;
  });

  it('empty without category; mounts list with category', () => {
    expect(renderShapeSelector(createInitialState(), () => undefined).children).toHaveLength(0);
    const state = {
      ...createInitialState(),
      currentDice: [2, 4] as [number, number],
      selectedCategory: 'domino' as const,
      phase: 'selectingShape' as const,
    };
    const el = renderShapeSelector(state, () => undefined);
    expect(el.className).toBe('juggle-shape-selector');
    expect(el.querySelector('.juggle-shape-header')!.textContent).toMatch(/domino/);
    expect(el.querySelectorAll('.juggle-shape-option').length).toBeGreaterThan(0);
  });
});
