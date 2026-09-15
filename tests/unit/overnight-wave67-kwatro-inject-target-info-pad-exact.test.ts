/**
 * Wave 67 leftover after tip/#324 — Kwatro target-info padding exact.
 * Wave63 locks type/strong; deepen pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject target-info pad exact', () => {
  it('target-info uses padding 0.5rem 1rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(
      /\.kwa-target-info\s*\{[\s\S]*?padding:\s*0\.5rem 1rem/
    );
  });
});
