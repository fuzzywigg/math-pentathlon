/**
 * q-mp-112 mutation audit UI wave 3 — kill survivors in route-generation.
 * No product src/ edits; exact ±1 increment assertions.
 */
import { describe, expect, it, vi } from 'vitest';

describe('mutation-ui3 route-generation', () => {
  it('module generation starts at 0 before any nextRouteGeneration', async () => {
    // Survivor: initial `let generation = 0` → 1
    vi.resetModules();
    const mod = await import('../../src/core/route-generation');
    expect(mod.getRouteGeneration()).toBe(0);
    expect(mod.nextRouteGeneration()).toBe(1);
    expect(mod.getRouteGeneration()).toBe(1);
  });

  it('nextRouteGeneration increments by exactly 1', async () => {
    // Survivor: generation += 1 → += 2
    vi.resetModules();
    const mod = await import('../../src/core/route-generation');
    const a = mod.nextRouteGeneration();
    const b = mod.nextRouteGeneration();
    expect(b - a).toBe(1);
    expect(mod.isCurrentRouteGeneration(a)).toBe(false);
    expect(mod.isCurrentRouteGeneration(b)).toBe(true);
  });
});
