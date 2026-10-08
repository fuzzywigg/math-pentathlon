/**
 * Wave 63 leftover after #301 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave59 select-king / Ready to Play / Red Trapezoids handshake. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { renderBoard as renderHex, renderStatus as hexStatus } from '../../src/games/hex/board-ui';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderHexagone, renderStatus as hexagoneStatus } from '../../src/games/hex-a-gone/board-ui';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual tutorial + renderer + groups + players + CSS mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome')?.title
    ).toBe('Welcome to Kings & Quadraphages!');
    expect(hexTutorial.steps.find((s) => s.id === 'winning')?.message).toMatch(
      /no draws possible/
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes')?.title
    ).toBe('Selecting Shapes');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('font-size: 14px');

    const hexEl = document.createElement('div');
    renderHex(hexInit(5), hexEl);
    expect(hexEl.querySelectorAll('.hex-cells')).toHaveLength(1);
    expect(hexEl.querySelectorAll('.hex-labels')).toHaveLength(1);

    const hexStat = document.createElement('div');
    hexStatus(hexInit(5), hexStat, 'human-vs-human');
    expect(hexStat.querySelectorAll('.hex-legend-item')).toHaveLength(2);

    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl, undefined, undefined, () => {});
    expect(goneEl.querySelectorAll('.hex-a-gone-selection-area')).toHaveLength(1);
    expect(goneEl.querySelectorAll('.hex-a-gone-bank-blocks')).toHaveLength(1);

    const goneStat = document.createElement('div');
    hexagoneStatus(hexagoneInit(), goneStat, 'human-vs-human');
    expect(goneStat.querySelectorAll('.hex-a-gone-players')).toHaveLength(1);

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('stroke: #7a6448');
    expect(css).toContain('#48bb78');
    expect(css).toContain('@keyframes hexFillPlace');
  });
});
