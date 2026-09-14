/**
 * Overnight HEAVY leftover after #264 — stubNarrationFor unknown-chrome branch.
 * Distinct from wave56 howto/tutorial/back chrome DOM. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 57 core owl — unknown-chrome stub', () => {
  it('unknown-chrome narrates shell chrome', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'unknown-chrome' })
    ).toMatch(/Chrome on the page/i);
  });
});
