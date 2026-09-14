/**
 * Wave 55 leftover after #250 — Kwatro inject CSS + SVG viewBox + edge stroke. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import {
  injectKwaStyles,
  renderBoard,
} from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 55 kwatro — inject + board chrome', () => {
  it('glow CSS, 420 viewBox, #999 stroke-width 2, no valids opening', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toContain('@keyframes kwa-glow');
    expect(css).toContain('.kwa-winning-expr');
    expect(css).toContain('.kwa-target-info');
    expect(css).toContain('@media (max-width: 768px)');
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(el.querySelector('svg.kwa-svg')?.getAttribute('viewBox')).toBe('0 0 420 420');
    const line = el.querySelector('line');
    expect(line?.getAttribute('stroke')).toBe('#999');
    expect(line?.getAttribute('stroke-width')).toBe('2');
    expect(el.querySelectorAll('.kwa-valid-node')).toHaveLength(0);
  });
});
