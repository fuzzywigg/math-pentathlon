import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerPwa,
  resetPwaReloadGuardForTests,
} from '../../src/pwa/register';

describe('registerPwa', () => {
  afterEach(() => {
    resetPwaReloadGuardForTests();
    vi.restoreAllMocks();
  });

  it('skips registration when service workers are unavailable', () => {
    const registerSW = vi.fn();
    const result = registerPwa({
      enabled: false,
      registerSW,
    });
    expect(registerSW).not.toHaveBeenCalled();
    expect(result.update).toBeUndefined();
  });

  it('registers with immediate update checks', () => {
    const update = vi.fn();
    const registerSW = vi.fn(() => update);
    const result = registerPwa({
      enabled: true,
      registerSW,
      reload: vi.fn(),
    });

    expect(registerSW).toHaveBeenCalledOnce();
    expect(registerSW.mock.calls[0]?.[0]).toMatchObject({ immediate: true });
    expect(result.update).toBe(update);
  });

  it('reloads once when a new service worker is waiting', () => {
    const reload = vi.fn();
    let onNeedRefresh: (() => void) | undefined;

    const registerSW = vi.fn((opts: { onNeedRefresh?: () => void }) => {
      onNeedRefresh = opts.onNeedRefresh;
      return vi.fn();
    });

    registerPwa({ enabled: true, registerSW, reload });
    onNeedRefresh?.();
    onNeedRefresh?.();

    expect(reload).toHaveBeenCalledOnce();
  });
});
