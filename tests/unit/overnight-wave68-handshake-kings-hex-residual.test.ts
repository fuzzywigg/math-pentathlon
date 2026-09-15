/**
 * Wave 68 leftover after tip/#334 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave67 (#334) trap/welcome/fill softs: locks unsaturated exacts. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual tutorial + renderer + CSS mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain('a strategic two-player game from Math Pentathlon');
    expect(hexTutorial.steps.find((s) => s.id === 'complete')?.message).toContain(
      'Now you know how to play Hex!'
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes')?.message
    ).toContain('Shapes must fit in empty spaces!');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toMatch(/\.game-board\s*\{[^}]*padding:\s*16px/s);

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linecap:\s*round/s);
    expect(css).toContain('animation: hexValidPulse 2s ease-in-out infinite');
    expect(css).toContain('animation: placingInfoPulse 2s ease-in-out infinite');
  });
});
