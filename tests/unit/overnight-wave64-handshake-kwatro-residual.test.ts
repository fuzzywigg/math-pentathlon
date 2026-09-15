/**
 * Wave 64 leftover after tip/#306 — Kwatro residual inject × tutorial × opening handshake.
 * Distinct from wave60/63 handshakes; deepen btn/welcome/controls leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 64 handshake — kwatro residual', () => {
  it('btn border none + welcome three chips + opening no controls + strategy center li', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[^}]*border:\s*none/);
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[^}]*color:\s*white/);
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[^}]*margin:\s*1rem/);

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome')?.message
    ).toContain('Create an alignment of three chips where');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('<li>Control the center to maximize movement options</li>');
    expect(kwatroSinkoTutorial.steps).toHaveLength(8);

    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    expect(ctrl.isAI).toBe(false);
    expect(root.querySelector('.kwa-controls')).toBeNull();
    expect(root.querySelector('.kwa-board')).toBeTruthy();
  });
});
