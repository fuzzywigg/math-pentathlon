/**
 * Wave 68 leftover after tip/#336 — Kwatro residual handshake (unit-only).
 * Distinct from wave67 flex/border; deepen align/gap/setup exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 handshake — kwatro residual chrome', () => {
  it('align-items/gap scoped + hard AI + Blue Even exact', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.kwa-controls\s*\{[\s\S]*?justify-content:\s*center/);
    expect(css).toMatch(/\.kwa-history\s*\{[\s\S]*?max-width:\s*250px/);

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root, 'hard');
    expect(ctrl.aiDifficulty).toBe('hard');
    expect(root.querySelector('.kwa-game-area')).toBeTruthy();

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'setup')?.message
    ).toContain(
      '<li><strong>Blue (Player 1):</strong> Even chips (0, 2, 4, 6, 8)</li>'
    );
  });
});
