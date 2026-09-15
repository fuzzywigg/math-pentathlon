/**
 * Wave 67 leftover after tip/#324 — Hex strategy bridges two-paths exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial strategy bridges two paths', () => {
  it('strategy-tips locks bridges two-paths exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      'Create "bridges" - two pieces that can connect via two paths'
    );
    expect(step?.position).toBe('center');
  });
});
