/**
 * Overnight HEAVY leftover after #274 — stubNarrationFor unknown-chrome kind.
 * Distinct from wave57 stub-unknown-chrome resolve path. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 58 core owl — stub unknown-chrome', () => {
  it('unknown-chrome narration mentions shell', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'unknown-chrome' })
    ).toMatch(/Chrome on the page/i);
  });
});
