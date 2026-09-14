/**
 * Wave 64 leftover after tip/#303 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from open #302 wave63 (welcome title / no draws / Selecting Shapes). Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { createInitialState as hexagoneInit } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderHexagone } from '../../src/games/hex-a-gone/board-ui';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual tutorial + renderer + bank + CSS mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toMatch(/push your opponent toward a corner or edge/);
    expect(hexTutorial.steps.find((s) => s.id === 'strategy-tips')?.message).toMatch(
      /Control the center of the board/
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'strategy-tip')?.message
    ).toMatch(/leave awkward spaces/);

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('background-color: #ffecd2');
    expect(kingsCss).toContain('linear-gradient(135deg, #f4a460 0%, #daa520 50%, #f4a460 100%)');

    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl, undefined, undefined, () => {});
    expect(goneEl.querySelector('.hex-a-gone-bank-title')?.textContent).toBe(
      'Pattern Block Bank'
    );

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('animation: hexWinPulse 1s ease-in-out infinite');
    expect(css).toContain('.hex-a-gone-confirm-btn:hover');
    expect(css).toContain('box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4)');
  });
});
