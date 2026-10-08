import { describe, expect, it } from 'vitest';
import {
  getRouteGeneration,
  isCurrentRouteGeneration,
  nextRouteGeneration,
} from '../../src/core/route-generation';

describe('route-generation', () => {
  it('increments and recognizes the current generation', () => {
    const a = nextRouteGeneration();
    expect(isCurrentRouteGeneration(a)).toBe(true);
    expect(getRouteGeneration()).toBe(a);

    const b = nextRouteGeneration();
    expect(b).toBeGreaterThan(a);
    expect(isCurrentRouteGeneration(a)).toBe(false);
    expect(isCurrentRouteGeneration(b)).toBe(true);
    expect(getRouteGeneration()).toBe(b);
  });
});
