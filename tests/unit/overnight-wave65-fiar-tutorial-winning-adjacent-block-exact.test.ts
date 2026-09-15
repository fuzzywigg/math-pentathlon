/**
 * Wave 65 leftover after tip/#305 — FIAR winning adjacent-block exact.
 * Soft adjacent/prevents regex; lock full Blocking strong sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial winning adjacent block exact', () => {
  it('winning Blocking sentence mentions adjacent opponent chip', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      "<li><strong>Blocking:</strong> An opponent chip adjacent to your 4-in-a-row prevents the win!</li>"
    );
    expect(step?.position).toBe('center');
  });
});
