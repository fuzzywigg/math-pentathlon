/**
 * Wave 68 leftover after tip/#336 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave67 (#334) trap/welcome/CSS softs: locks unsaturated exacts. Tests-only.
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
    ).toContain('Math Pentathlon');
    expect(hexTutorial.steps.find((s) => s.id === 'winning')?.message).toContain(
      'no draws possible'
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'goal')?.message
    ).toContain('<strong>last player who can place a shape</strong>');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('padding: 16px');

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: url(#hex-empty-gradient)');
    expect(css).toContain('stroke-width: 8');
    expect(css).toContain('gap: 1.5rem');
  });
});
