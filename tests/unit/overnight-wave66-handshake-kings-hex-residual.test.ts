/**
 * Wave 66 leftover after tip/#316 (unit-only) — Handshake kings × hex × hexagone residual.
 * Distinct from wave64 (#313) corner/bridges/awkward softs; deepen exact traps + chrome. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard as renderKingsRenderer } from '../../src/games/kings-quadraphages/board-renderer';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 handshake — kings/hex leftovers', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('residual exact trap + solved + riskier + board shadow + move-count', () => {
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'objective')?.message
    ).toContain('<strong>trap your opponent\'s King</strong>');
    expect(hexTutorial.steps.find((s) => s.id === 'winning')?.message).toContain(
      'Hex is a solved game - there are no draws possible!'
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'turn-structure')?.message
    ).toContain('More shapes = Riskier but fills the board faster!');

    renderKingsRenderer(createInitialBoard());
    const kingsCss =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(kingsCss).toContain('box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)');
    expect(kingsCss).toContain('width: 80%');

    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-move-count {');
    expect(css).toMatch(/\.hex-move-count\s*\{[^}]*color:\s*#666/s);
    expect(css).toContain('.hex-a-gone-status {');
    expect(css).toContain('text-transform: capitalize');
  });
});
