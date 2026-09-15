/**
 * Wave 65 leftover after tip/#315 — Kwatro residual handshake (unit-only).
 * Distinct from wave63 game-area/Red/Objective; deepen flex/border/strategy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsAI } from '../../src/games/kwatro-sinko/game-controller';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 handshake — kwatro residual chrome', () => {
  it('display-flex/border-none + medium AI + Control the center exact', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-game-area\s*\{[\s\S]*?display:\s*flex/);
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?border:\s*none/);
    expect(css).toContain('margin: 1rem');
    expect(css).toContain('from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }');

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsAI(root);
    expect(ctrl.aiDifficulty).toBe('medium');
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
