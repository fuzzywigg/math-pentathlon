/**
 * Wave 40 — poly-ui shape selector empty/labels + rotation CW/CCW + drag leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  SIMPLE_SHAPES,
  createShapeSelector,
  createRotationControls,
  createDraggableShape,
  injectPolyominoStyles,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('polyomino-styles')?.remove();
  vi.restoreAllMocks();
});

const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;

describe('Wave 40 poly-ui — selector / rotate / drag', () => {
  it('empty shape selector yields no options', () => {
    const panel = createShapeSelector([], () => undefined);
    expect(panel.className).toBe('shape-selector');
    expect(panel.querySelectorAll('.shape-option')).toHaveLength(0);
  });

  it('selector labels match shape.name and mouseleave clears border', () => {
    const shapes = SIMPLE_SHAPES.slice(0, 2);
    const panel = createShapeSelector(shapes, () => undefined);
    const options = [
      ...panel.querySelectorAll('.shape-option'),
    ] as HTMLElement[];
    expect(options).toHaveLength(2);
    expect(options[0].textContent).toContain(shapes[0].name);
    options[0].dispatchEvent(new Event('mouseenter'));
    // jsdom may normalize hex → rgb()
    expect(options[0].style.borderColor.replace(/\s/g, '')).toMatch(
      /#9e9e9e|rgb\(158,158,158\)/i
    );
    options[0].dispatchEvent(new Event('mouseleave'));
    expect(options[0].style.borderColor).toBe('transparent');
  });

  it('rotation controls fire ccw then cw; flip optional', () => {
    const dirs: Array<'cw' | 'ccw'> = [];
    const withFlip = createRotationControls(
      (d) => dirs.push(d),
      () => undefined,
      true
    );
    const buttons = [...withFlip.querySelectorAll('button')];
    expect(buttons).toHaveLength(3);
    buttons[0].dispatchEvent(new Event('click'));
    buttons[1].dispatchEvent(new Event('click'));
    expect(dirs).toEqual(['ccw', 'cw']);

    const noFlip = createRotationControls(() => undefined, () => undefined, false);
    expect(noFlip.querySelectorAll('button')).toHaveLength(2);
  });

  it('draggable shape dragstart payload includes rotation/flipped', () => {
    const el = createDraggableShape(domino, 180, true, { cellSize: 12 });
    expect(el.dataset.rotation).toBe('180');
    expect(el.dataset.flipped).toBe('true');
    const store: Record<string, string> = {};
    const start = new Event('dragstart', { bubbles: true }) as Event & {
      dataTransfer: { setData: (k: string, v: string) => void };
    };
    start.dataTransfer = {
      setData: (k, v) => {
        store[k] = v;
      },
    };
    el.dispatchEvent(start);
    expect(JSON.parse(store['application/json'])).toEqual({
      shapeId: 'domino',
      rotation: 180,
      flipped: true,
    });
    expect(el.style.opacity).toBe('0.5');
    el.dispatchEvent(new Event('dragend'));
    expect(el.style.opacity).toBe('1');
  });

  it('draggable mouseleave resets scale; inject styles once', () => {
    const el = createDraggableShape(domino, 0, false);
    el.dispatchEvent(new Event('mouseenter'));
    expect(el.style.transform).toContain('scale');
    el.dispatchEvent(new Event('mouseleave'));
    expect(el.style.transform).toBe('scale(1)');

    injectPolyominoStyles();
    injectPolyominoStyles();
    expect(document.querySelectorAll('#polyomino-styles')).toHaveLength(1);
  });
});
