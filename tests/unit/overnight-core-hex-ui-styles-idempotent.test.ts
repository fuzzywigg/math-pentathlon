/**
 * Overnight TOKENMAXX — injectHexStyles module flag is idempotent.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectHexStyles, createInteractiveHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('style')
    .forEach((s) => {
      if (s.textContent?.includes('.hex-cell')) s.remove();
    });
});

describe('Overnight core hex-ui — styles idempotent', () => {
  it('repeated injectHexStyles does not stack duplicate style tags beyond first module inject', () => {
    // Module may already have injected in prior tests; count delta on further calls
    const before = document.querySelectorAll('style').length;
    injectHexStyles();
    injectHexStyles();
    injectHexStyles();
    const after = document.querySelectorAll('style').length;
    expect(after - before).toBeLessThanOrEqual(1);

    const host = document.createElement('div');
    document.body.appendChild(host);
    createInteractiveHexGrid(host, 0, createLayout());
    const afterInteractive = document.querySelectorAll('style').length;
    expect(afterInteractive).toBeGreaterThanOrEqual(after);
  });
});
