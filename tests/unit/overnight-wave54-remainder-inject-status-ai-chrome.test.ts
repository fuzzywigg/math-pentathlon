/**
 * Overnight HEAVY leftover after #241 — inject vs-AI status chrome leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectRemainderIslandsStyles } from '../../src/games/remainder-islands/board-ui';

afterEach(() => {
  document.getElementById('remainder-islands-styles')?.remove();
});

describe('Wave 54 remainder — inject AI status', () => {
  it('CSS includes data-opponent ai status backgrounds', () => {
    injectRemainderIslandsStyles();
    const css = document.getElementById('remainder-islands-styles')!.textContent || '';
    expect(css).toContain('[data-opponent="ai"] .remainder-status.player2');
    expect(css).toContain('#ede9fe');
    expect(css).toContain('.remainder-btn-roll');
  });
});
