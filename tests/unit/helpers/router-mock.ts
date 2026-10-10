/**
 * Shared soft-fail / residual suite `src/core/router` mock factories (q-mp-748).
 *
 * Prefer async factories so Vitest hoist stays safe under ESM:
 *   vi.mock('../../src/core/router', async () => {
 *     const { mockRouterModule } = await import('./helpers/router-mock');
 *     return mockRouterModule();
 *   });
 *
 * Keep behavioral asserts and test counts in adopting suites unchanged.
 */
import { vi } from 'vitest';

/** navigate + handleRoute — game-route-mounts soft-fail / residual suites. */
export function mockRouterModule(): {
  navigate: ReturnType<typeof vi.fn>;
  handleRoute: ReturnType<typeof vi.fn>;
} {
  return {
    navigate: vi.fn(),
    handleRoute: vi.fn(),
  };
}

/** navigate-only — demo residual / coverage suites. */
export function mockRouterNavigateModule(): {
  navigate: ReturnType<typeof vi.fn>;
} {
  return {
    navigate: vi.fn(),
  };
}
