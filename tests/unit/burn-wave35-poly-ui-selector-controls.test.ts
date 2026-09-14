/**
 * Wave 35 — shape selector / rotation controls / styles leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  SIMPLE_SHAPES,
  TETROMINOES,
  createShapeSelector,
  createRotationControls,
  injectPolyominoStyles,
} from '../../src/core/polyomino';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('polyomino-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 35 poly-ui-selector — options + hover chrome', () => {
  it('renders one option per shape with name labels', () => {
    const shapes = SIMPLE_SHAPES.slice(0, 4);
    const picked: string[] = [];
    const panel = createShapeSelector(shapes, (s) => picked.push(s.id), {
      cellSize: 16,
    });
    expect(panel.className).toBe('shape-selector');
    const opts = [...panel.querySelectorAll('.shape-option')] as HTMLElement[];
    expect(opts).toHaveLength(4);
    for (const s of shapes) {
      expect(panel.textContent).toContain(s.name);
    }
    opts[2].click();
    expect(picked).toEqual([shapes[2].id]);
  });

  it('hover sets border to shape color; leave clears', () => {
    const shape = SIMPLE_SHAPES[0];
    const panel = createShapeSelector([shape], () => {});
    const opt = panel.querySelector('.shape-option') as HTMLElement;
    opt.dispatchEvent(new Event('mouseenter'));
    // jsdom may normalize hex → rgb()
    expect(opt.style.borderColor.replace(/\s/g, '')).toMatch(
      /#9e9e9e|rgb\(158,158,158\)/i
    );
    expect(opt.style.background.replace(/\s/g, '')).toMatch(
      /#fff|#ffffff|rgb\(255,255,255\)|white/i
    );
    opt.dispatchEvent(new Event('mouseleave'));
    expect(opt.style.borderColor).toBe('transparent');
  });

  it('tetromino catalog selector embeds svg per option', () => {
    const panel = createShapeSelector(TETROMINOES, () => {});
    expect(panel.querySelectorAll('.shape-option')).toHaveLength(
      TETROMINOES.length
    );
    expect(panel.querySelectorAll('svg.polyomino')).toHaveLength(
      TETROMINOES.length
    );
  });

  it('empty shapes list yields empty selector', () => {
    const panel = createShapeSelector([], () => {});
    expect(panel.querySelectorAll('.shape-option')).toHaveLength(0);
  });
});

describe('Wave 35 poly-ui-controls — rotate / flip / styles', () => {
  it('button titles and order: ccw, cw, flip', () => {
    const rotates: string[] = [];
    const flips: number[] = [];
    const el = createRotationControls(
      (d) => rotates.push(d),
      () => flips.push(1),
      true
    );
    const btns = [...el.querySelectorAll('button')];
    expect(btns.map((b) => b.title)).toEqual([
      'Rotate counter-clockwise',
      'Rotate clockwise',
      'Flip horizontally',
    ]);
    btns[0].click();
    btns[1].click();
    btns[2].click();
    expect(rotates).toEqual(['ccw', 'cw']);
    expect(flips).toEqual([1]);
  });

  it('canFlip false omits flip button', () => {
    const el = createRotationControls(() => {}, () => {}, false);
    expect(el.querySelectorAll('button')).toHaveLength(2);
    expect([...el.querySelectorAll('button')].map((b) => b.title)).toEqual([
      'Rotate counter-clockwise',
      'Rotate clockwise',
    ]);
  });

  it('injectPolyominoStyles idempotent and includes keyframes', () => {
    injectPolyominoStyles();
    injectPolyominoStyles();
    const style = document.getElementById('polyomino-styles');
    expect(document.querySelectorAll('#polyomino-styles')).toHaveLength(1);
    expect(style?.textContent).toContain('@keyframes pulse-valid');
    expect(style?.textContent).toContain('.placement-preview');
    expect(style?.textContent).toContain('.draggable-shape:active');
  });
});
