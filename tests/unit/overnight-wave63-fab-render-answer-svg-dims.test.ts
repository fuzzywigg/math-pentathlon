/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab answer bar SVG dims.
 * Soft answer shell coverage exists; deepen width 80 + below-label height leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 63 fab — render answer svg dims', () => {
  it('answer bars render 80-wide SVG with below-label height 50', () => {
    const el = renderAnswerBoard(createInitialState(), () => {});
    document.body.appendChild(el);
    const svg = el.querySelector('.fab-answer-wrapper svg');
    // bar height 25 + below-label pad 25
    expect(svg?.getAttribute('width')).toBe('80');
    expect(svg?.getAttribute('height')).toBe('50');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 80 50');
  });
});
