/**
 * Wave 65 leftover after tip/#313 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave64 corner/center/awkward/#ffecd2/bank title/hexWinPulse. Tests-only.
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

describe('Wave 65 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual tutorial + renderer + wrapper + CSS mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toMatch(/Math Pentathlon/);
    expect(hexTutorial.steps.find((s) => s.id === 'strategy-tips')?.message).toMatch(
      /via two paths/
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro')?.message
    ).toContain('color: #FF4444');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toMatch(/\.piece\s*\{[^}]*border-radius:\s*50%/s);

    const goneEl = document.createElement('div');
    renderHexagone(hexagoneInit(), goneEl, undefined, undefined, () => {});
    expect(goneEl.querySelectorAll('.hex-a-gone-wrapper')).toHaveLength(1);

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linejoin:\s*round/s);
    expect(css).toContain('rgba(144, 238, 144, 0.4)');
  });
});
