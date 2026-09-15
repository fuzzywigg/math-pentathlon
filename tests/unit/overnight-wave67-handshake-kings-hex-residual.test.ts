/**
 * Wave 67 leftover after tip/#324 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave64 (#313) corner/center/awkward softs: locks unsaturated exacts. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual tutorial + renderer + CSS mount', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective')?.message
    ).toContain("<strong>trap your opponent's King</strong>");
    expect(hexTutorial.steps.find((s) => s.id === 'welcome')?.message).toContain(
      '<strong>Hex</strong>'
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain('<strong>Hex-a-Gone!</strong>');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)');

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))');
    expect(css).toContain('fill: rgba(144, 238, 144, 0.4)');
    expect(css).toContain('min-width: 55px');
  });
});
