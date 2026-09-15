/**
 * Wave 67 leftover after tip/#324 — Kwatro residual inject × mount handshake.
 * Distinct from wave60/63 handshakes; deepen flex/border/medium AI × strategy exacts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 handshake — kwatro residual chrome', () => {
  it('flex/border/medium AI × strategy/winning exacts', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?border:\s*none/);
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?margin:\s*1rem/);

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root);
    expect(ctrl.aiDifficulty).toBe('medium');
    expect(root.querySelector('.kwa-main-layout')).toBeTruthy();
    expect(root.querySelector('.kwa-history')).toBeNull();

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('<li>Control the center to maximize movement options</li>');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'winning')?.message
    ).toContain(
      '<li>The alignment must satisfy: <strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong></li>'
    );
  });
});
