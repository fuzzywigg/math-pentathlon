/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro residual inject × tutorial handshake.
 * Distinct from wave63 residual; deepen btn white + strategy Control + empty stroke. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles, renderBoard } from '../../src/games/kwatro-sinko/board-ui';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 66 handshake — kwatro residual chrome', () => {
  it('btn-primary white + strategy Control li + empty stroke-width 1', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn-primary\s*\{[\s\S]*?color:\s*white/);
    expect(css).toMatch(/\.kwa-winner-banner\s*\{[\s\S]*?margin:\s*1rem/);

    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips')?.message
    ).toContain('<li>Control the center to maximize movement options</li>');

    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(
      el.querySelector('[data-node-id="n2-2"] circle')?.getAttribute('stroke-width')
    ).toBe('1');
  });
});
