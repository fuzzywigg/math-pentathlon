/**
 * Wave 67 leftover after tip/#324 — Kwatro strategy-tips position center.
 * Titles covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial strategy position center', () => {
  it('strategy-tips uses center position', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.position).toBe('center');
  });
});
