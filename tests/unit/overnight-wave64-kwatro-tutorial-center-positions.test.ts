/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial center-position steps.
 * Wave63 locked welcome center; deepen objective/winning/strategy/complete. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial center positions', () => {
  it('objective/winning/strategy-tips/complete are center', () => {
    for (const id of ['objective', 'winning', 'strategy-tips', 'complete'] as const) {
      expect(
        kwatroSinkoTutorial.steps.find((s) => s.id === id)?.position
      ).toBe('center');
    }
  });
});
