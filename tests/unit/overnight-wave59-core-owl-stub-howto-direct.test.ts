/**
 * Overnight HEAVY leftover after #280 — stubNarrationFor howto direct.
 * DOM-free dual of wave58 inspectDropSpeech header leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 59 core owl — stub howto direct', () => {
  it('howto chrome stub mentions How to Play', () => {
    expect(
      stubNarrationFor({ kind: 'chrome', chrome: 'howto' })
    ).toMatch(/How to Play/i);
  });
});
